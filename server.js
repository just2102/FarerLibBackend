const express = require("express");
const colors = require("colors")
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db")
const dotenv = require("dotenv").config();
const app = express();

connectDB()

const port = process.env.PORT || 3000

const bookRouter = require("./routes/books");
const authorRouter = require("./routes/authors")

// middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use("/api/books", bookRouter);
app.use("/api/authors", authorRouter)

app.use(errorHandler)
// 
app.listen(port, () => console.log("port started on port " + port));
