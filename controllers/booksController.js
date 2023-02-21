const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const Author = require("../models/authorModel");
const Book = require("../models/bookModel");
const Cover = require("../models/coverModel")
const dotenv = require("dotenv")
const cloudinary = require('cloudinary').v2;

dotenv.config()
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// get all books
// @route GET /api/books
// @queryParam? title
const getBooks = asyncHandler(async (req, res) => {
  // console.log(req.query.title)
  if (req.query.title) {
    const book = await Book.findOne({ title: req.query.title })
    .populate("author")
    .populate("cover")
    res.status(200).json(book);
  } else {
    const books = await Book.find()
    .populate("author")
    .populate("cover")
    res.status(200).json(books);
  }
});
// post a book
// @route POST /api/books
const postBook = asyncHandler(async (req, res) => {
    const body = await req.body;
    // throw errors if either of the required fields is empty
    if (!body.title) {
      res.status(400).json({ message: "Title cannot be empty!" });
    }
    if (!body.author) {
      res.status(400).json({ message: "Author cannot be empty!" });
    }
    if (!body.genre) {
      res.status(400).json({ message: "Genre cannot be empty!" });
    }
    // creates a bookData object based on title, author and genre parameters provided
    // other parameters are optional
    let coverURL;
    let bookData = {
      title: body.title,
      author: body.author,
      genre: body.genre,
      available: body.available,
    };
    if (body.year) {
      bookData.year = body.year;
    }
    if (body.summary) {
      bookData.summary = body.summary;
    }
    try {
      const book = await Book.create(bookData);
      // create cover and associate it with the newly created book
      let cover;
      // case when cover is a user-uploaded image
      if (body.cover) {
        try {
          await cloudinary.uploader.upload(body.cover,{
            crop:'fill',
            width: 400,
            height: 600,
            gravity: 'center',
            quality: 80
          }).then(async response=>{
           const coverData = {
            bookId: book._id,
            public_id: response.public_id,
            resource_type: response.resource_type,
            bytes: response.bytes,
            url: response.url
           }
           cover = await Cover.create(coverData)
          })
        } catch(err) {
          console.error(err.code)
        }
     } 
     if (cover) {
      book.cover = cover
      // add cover id to the book
      await Book.updateOne(
      { _id: book._id},
      { $set: {cover: cover._id}}
    )
     }
    //  add book to its author
    await Author.updateOne(
        { _id: book.author },
        { $push: { books: book._id } }
      );
      res.status(200).json(book);
    } catch (err) {
      if (err.name === "ValidationError") {
        res.status(404).json({
          message:
            "Book's author was not found, please check author id provided or create a new author",
        });
      } else {
        throw err;
      }
    }
  });
// get book by id
// @route GET /api/books/:bookId
const getBookById = asyncHandler(async (req, res) => {
  // check for typeof bookId
  if (typeof req.params.bookId !== "string") {
    res.status(400);
    throw new Error("Invalid bookId. It should be a string");
  }
  // if type is valid (string), continue
  const book = await Book.findById(req.params.bookId).populate("author").populate("cover");
  // if book was not found, return 'book not found' message
  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }
  res.status(200).json(book);
});

// delete book by id
// @route DELETE /api/books/:bookId
const deleteBookById = asyncHandler(async (req, res) => {
  //   check for bookId type (should be a string)
  if (typeof req.params.bookId !== "string") {
    res.status(400);
    throw new Error("Invalid bookId. It should be a string");
  }
  const bookToDelete = await Book.findByIdAndDelete(req.params.bookId);
  if (!bookToDelete) {
    res.status(404).json({ message: "Book not found! Check id" });
  }
  // delete book cover from db and cloudinary if it exists
  if (bookToDelete.cover) {
    await Cover.findByIdAndDelete(bookToDelete.cover).then((result)=>
      cloudinary.uploader.destroy(result.public_id, {resource_type:'image'}, function(error,result) {
        console.log(result, error)
      })
    )
  }
  await Author.updateOne(
    { _id: bookToDelete.author },
    { $pull: { books: bookToDelete._id } }
  );
  res.status(200).json({ message: "Book successfully deleted" });
});

// update book by id
// @route PUT /api/books/:bookId
const updateBookById = asyncHandler(async (req, res) => {
  // check for necessary book properties (title,author and genre)
  if (!req.body.title) {
    return res.status(400).json({ message: "Please specify the book's title" });
  }
  if (!req.body.author) {
    return res
      .status(400)
      .json({ message: "Please specify the book's author" });
  }
  if (!req.body.genre) {
    return res.status(400).json({ message: "Please specify the book's genre" });
  }
  const newBookObject = {
    title:req.body.title,
    author: req.body.author,
    year: req.body.year,
    summary: req.body.summary,
    genre: req.body.genre,
    available: req.body.available
  }
  const bookToUpdate = await Book.findByIdAndUpdate(req.params.bookId, newBookObject);
  if (!bookToUpdate) {
    res.status(404).json({ message: "Book not found! Check id" });
  }
  // create cover entry in DB and associate it with the newly-created book
  // but only if it is a new cover
  let cover;
    if (req.body.cover && req.body.cover!=="NOCHANGE") {
      try {
        await cloudinary.uploader.upload(req.body.cover,{
          crop:'fill',
          width: 400,
          height: 600,
          gravity: 'center',
          quality: 80
        }).then(async response=>{
          const coverData = {
          bookId: bookToUpdate._id,
          public_id: response.public_id,
          resource_type: response.resource_type,
          bytes: response.bytes,
          url: response.url
          }
          cover = await Cover.create(coverData)
          })
        } catch(err) {
          console.error(err.code)
        }
    }
    // add cover id to the book document in DB
    if (cover) {
        newBookObject.cover = cover
        await Book.updateOne(
          { _id: bookToUpdate._id},
          { $set: {cover: cover._id}}
        )
    }
  // remove old cover if it existed and was replaced
  if (bookToUpdate.cover && cover) {
    if (bookToUpdate.cover !== cover._id) {
      await Cover.findByIdAndDelete(bookToUpdate.cover).then((result)=>
      cloudinary.uploader.destroy(result.public_id, {resource_type:'image'}, function(error,result) {
        console.log(result, error)
      })
    )
    }
  }
  // finally, get the newly-created book and return it
  const finallyUpdatedBook = await Book.findById(bookToUpdate._id).populate('author').populate('cover')
  res.status(200).json({data: finallyUpdatedBook,message: "Book successfully updated" });
});

// change book status
// @route PATCH /api/books/:bookId
const changeBookStatus = asyncHandler(async (req, res) => {
  const newStatus = !req.body.available;
  const booktoChange = await Book.findByIdAndUpdate(req.params.bookId, {
    available: newStatus,
  });
  if (!booktoChange) {
    res.status(404).json({ message: "Book not found! Check id!" });
  }
  // await Author.updateOne({_id: booktoChange.author}, {$pull: {books: booktoChange._id}})
  res.status(200).json({
    message: `Book availability status was successfully changed! New status: ${newStatus}`,
  });
});

module.exports = {
  getBooks,
  postBook,

  getBookById,
  deleteBookById,
  updateBookById,
  changeBookStatus,
};
