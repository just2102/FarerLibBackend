const express = require("express");
const colors = require("colors")
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db")
const dotenv = require("dotenv").config();
const app = express();
app.use(express.json())
// allow cors 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  app.use(errorHandler)

connectDB()

const port = process.env.PORT || 3000

const bookRouter = require("./routes/books");
const authorRouter = require("./routes/authors")

// middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use("/api/books", bookRouter);
app.use("/api/authors", authorRouter)


// 
app.listen(port, () => console.log("port started on port " + port));
