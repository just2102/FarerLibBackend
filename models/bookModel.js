const mongoose = require("mongoose")
const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title cannot be blank'],
        validate: {
            validator: function(value) {
                return typeof value === 'string';
            },
            message: 'Title must be a string'
        }
    },
    author: {
        type: String,
        required: [true, 'Author cannot be blank'],
        validate: {
            validator: function(value) {
                return typeof value === 'string';
            },
            message: 'Author must be a string'
        }
    },
    year: {
        type: Number,
        required: false,
        validate: {
            validator: function(value) {
                return typeof value === 'number';
            },
            message: 'Year must be a number'
        }
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Book', bookSchema)