const express = require("express")
const { getBooks, postBook, getBookById, deleteBookById, updateBookById } = require("../controllers/booksController")
const router = express.Router()

router.route("/")
.get(getBooks)
.post(postBook)

router.route("/:bookId")
.get(getBookById)
.delete(deleteBookById)
.put(updateBookById)

module.exports = router