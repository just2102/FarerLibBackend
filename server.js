const express = require("express");
const colors = require("colors")
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db")
const session = require("express-session");
const dotenv = require("dotenv").config();
const cors = require("cors")
const app = express();
app.use(express.json({limit:'50mb'}))
app.use(session({
  secret: process.env.SECRET_TOKEN,
  resave: false,
  saveUninitialized: true
}));
// allow cors 
// app.use(cors())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });
app.use(errorHandler)
connectDB()

const port = process.env.PORT || 3000

const bookRouter = require("./routes/books");
const authorRouter = require("./routes/authors")
const authRouter = require("./routes/auth")
const dalleRouter = require("./routes/dalle")

// middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/api/books", bookRouter);
app.use("/api/authors", authorRouter)
app.use("/api/auth", authRouter)
app.use("/api/dalle", dalleRouter)


// 
app.listen(port, () => console.log("server started on port " + port));
