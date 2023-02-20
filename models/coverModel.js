const mongoose = require("mongoose");

const coverSchema = mongoose.Schema(
    {
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required:true
        },
        public_id: {
            type: String,
            required:true,
        },
        resource_type: {
            type: String,
            required:true
        },
        bytes: {
            type: Number,
            required:true
        },
        url: {
            type: String,
            required: true
        }
    }
)

module.exports = mongoose.model("Cover", coverSchema);