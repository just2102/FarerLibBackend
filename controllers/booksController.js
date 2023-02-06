const asyncHandler = require("express-async-handler")
// get all books
// @route GET /api/books
// @queryParam? title
const getBooks = asyncHandler(async(req,res) => {
    console.log(req.query.title)
    if (req.query.title) {
        res.json({title:req.query.title})
    } else {
        res.json({books:['book1','book2']})
    }
})
// post a book
// @route POST /api/books
const postBook = asyncHandler(async(req,res) => {
    if (!req.body.title) {
        res.status(400)
        throw new Error('Title cannot be empty')
    } else {
        res.status(200).json({title:req.body.title})
    }
})

// get book by id
// @route GET /api/books/:bookId
const getBookById = asyncHandler(async(req,res) => {
    res.json({message: `send book with id ${req.params.bookId}`})
})
// delete book by id
// @route DELETE /api/books/:bookId
const deleteBookById = asyncHandler(async(req,res) => {
    res.json({message: `Book with id ${req.params.bookId} successfully deleted`})
})


module.exports = {
    getBooks,
    postBook,

    getBookById,
    deleteBookById
}