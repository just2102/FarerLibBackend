const mongoose = require("mongoose");
const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      maxLength: 100,
      required: [true, "Title cannot be blank"],
      validate: {
        validator: function (value) {
          return typeof value === "string";
        },
        message: "Title must be a string",
      },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: [true, "All books have authors"],
    },
    year: {
      type: Number,
      maxLength: 5,
      required: false,
      validate: {
        validator: function (value) {
          return typeof value === "number";
        },
        message: "Year must be a number",
      },
    },
    summary: {
      type: String,
      maxLength: 1000,
      required: false,
      validate: {
        validator: function (value) {
          return typeof value === "string";
        },
        message: "Summary should be a string",
      },
    },
    genre: {
      type: String,
      maxLength: 50,
      //   20 most popular genres hard-coded here (genre can only be set to one of them)
      //    + 'fiction' (general fiction)
      enum: [
        "Action and Adventure",
        "Biography",
        "Children's",
        "Comedy",
        "Crime",
        "Drama",
        "Dystopia",
        "Fantasy",
        "Fiction",
        "Historical Fiction",
        "Horror",
        "Mystery",
        "Non-Fiction",
        "Poetry",
        "Romance",
        "Science Fiction",
        "Self-Help",
        "Textbook",
        "Thriller",
        "Young Adult",
        "Classics",
      ],
      required: true,
    },
    available: {
      type: Boolean,
      required:true,
    },
    cover: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cover",
      required:false
     },
    users: [
      {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
      }
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", bookSchema);
