const express = require("express");
const { errorHandler } = require("./middleware/errorMiddleware");
const dotenv = require("dotenv").config();
const app = express();

const port = process.env.PORT || 3000;

const bookRouter = require("./routes/books");

// middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use("/api/books", bookRouter);

app.use(errorHandler)
// 
app.listen(port, () => console.log("port started on port " + port));
