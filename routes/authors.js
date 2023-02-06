const express = require("express")
const {getAuthors, postAuthor, getAuthorById} = require("../controllers/authorsController")
const router = express.Router()

router.route("/")
.get(getAuthors)
.post(postAuthor)

router.route("/:authorId")
.get(getAuthorById)


module.exports = router