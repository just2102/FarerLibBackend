const express = require("express")
const { getBooks, postBook, getBookById, deleteBookById, updateBookById, changeBookStatus } = require("../controllers/booksController")
const router = express.Router()
const path = require('path')
var fs = require('fs');
const imgModel = require("../models/fileModel")
// configure multer MW to store book covers
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, '../FarerLibBackend/Covers')
    },
    filename: (req, file, cb) => {
        console.log(file)
        // file is a variable containing the actual file
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage: storage})
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
  .post(upload.single('cover'), async (req, res) => {
    const file = new File({
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
    await file.save();

    res.status(200).json({ message: 'Image uploaded' });
  });

module.exports = router