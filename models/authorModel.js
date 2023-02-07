const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const authorSchema = new Schema({
    _id: Schema.Types.ObjectId,
    first_name: {
        type: String,
        required: true, maxLength: 100
    },
    last_name: {
        type: String,
        required: true, maxLength: 100
    },
    date_of_birth: {
        type: Date
    },
    date_of_death: {
        type: Date
    }
})

module.exports = mongoose.model("Author",authorSchema)