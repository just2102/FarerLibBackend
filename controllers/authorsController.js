const asyncHandler = require("express-async-handler")
const mongoose = require("mongoose")
const Author = require("../models/authorModel")

// get all authors from db
// @route GET   /api/authors
const getAuthors = asyncHandler(async(req,res)=>{
    const authors = await Author.find()
    if (!authors.length) {
        res.status(404)
        throw new Error('Authors not found, please add a new author!')
    } else {
        res.status(200).json(authors)
    }

})

// add a new author to db
// @route POST /api/authors
const postAuthor = asyncHandler(async(req,res)=>{
    // dates of birth and death are optional
    // first and last names are required
    const newAuthorData = {
        _id: new mongoose.Types.ObjectId(),
        first_name: req.body.first_name,
        last_name: req.body.last_name,
    }
    if (req.body.date_of_birth) {
        newAuthorData.date_of_birth = req.body.date_of_birth
    }
    if (req.body.date_of_death) {
        newAuthorData.date_of_death = req.body.date_of_death
    }
    const newAuthor = await Author.create(newAuthorData)
    // return new author to user after successful db insertion
    res.status(200).json(newAuthor)
})

// get an author by id
// @route GET /api/authors?authorId=123456
const getAuthorById = asyncHandler(async(req,res)=>{
    if (typeof req.params.authorId!=='string') {
        res.status(400)
        throw new Error('authorId should be a string!')
    }
    const author = await Author.findOne({"_id":  mongoose.Types.ObjectId(req.params.authorId)})
    if (!author) {
        res.status(404)
        throw new Error ('Author not found!')
    } else {
        res.status(200).json(author)
    }
})




module.exports = {
    getAuthors,
    postAuthor,

    getAuthorById
}
