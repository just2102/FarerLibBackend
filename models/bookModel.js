const mongoose = require("mongoose")
const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title cannot be blank']
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Book', bookSchema)