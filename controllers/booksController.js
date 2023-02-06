const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');

const Book = require("../models/bookModel");
// get all books
// @route GET /api/books
// @queryParam? title
const getBooks = asyncHandler(async (req, res) => {
  // console.log(req.query.title)
  if (req.query.title) {
    const book = await Book.findOne({ title: req.query.title });
    res.status(200).json(book);
  } else {
    const books = await Book.find();
    res.status(200).json(books);
  }
});
// post a book
// @route POST /api/books
const postBook = asyncHandler(async (req, res) => {
  // throw errors if either of the required fields is empty
  if (!req.body.title) {
    res.status(400);
    throw new Error("Title cannot be empty!");
  }
  if (!req.body.author) {
    res.status(400);
    throw new Error("Book has to have an author!");
  }
  if (!req.body.genre) {
    res.status(400);
    throw new Error("Book's genre should be specified")
  }
  // creates a bookData object based on title, author and genre parameters provided
  // year parameter is optional
  const bookData = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre
  };
  if (req.body.year) {
    bookData.year = req.body.year;
  }
  try {
    const book = await Book.create(bookData);
    res.status(200).json(book);
  } catch (err) {
    if (err.name==='ValidationError') {
      res.status(404).json({message:"Book's author was not found, please check author id provided or create a new author"})
    } else {
      throw err
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
  const book = await Book.findById(req.params.bookId);
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
  const bookToDelete = await Book.deleteOne({ "_id": mongoose.Types.ObjectId(req.params.bookId) });
  if (bookToDelete.acknowledged && bookToDelete.deletedCount===0) {
    res.status(404);
    throw new Error('Book not found. It was either already deleted or the id provided was incorrect.')
  }
  if (bookToDelete.acknowledged && bookToDelete.deletedCount===1) {
    res.status(200).json({message: 'Book successfully deleted'})
  }
});

module.exports = {
  getBooks,
  postBook,

  getBookById,
  deleteBookById,
};
