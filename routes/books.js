const express = require("express")
const { getBooks, postBook, getBookById, deleteBookById, updateBookById, changeBookStatus } = require("../controllers/booksController")
const router = express.Router()
const path = require('path')
var fs = require('fs');

// 
router.route("/")
.get(getBooks)
.post(postBook)

router.route("/:bookId")
.get(getBookById)
.delete(deleteBookById)
.put(updateBookById)
.patch(changeBookStatus)

router.route("/upload")
.post(async(req,res)=>{

})

module.exports = router