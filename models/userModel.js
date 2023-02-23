const { Schema, model } = require("mongoose");

const User = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: [
{
      type: String,
      ref: "Role",
    },
  ],
  books: [{type: Schema.Types.ObjectId, ref: 'Book'}]
});

module.exports = model("User", User);

