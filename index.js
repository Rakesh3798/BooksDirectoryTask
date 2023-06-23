const mongoose = require("mongoose");
const express = require("express");
const app = express();
app.use(express.json());
const fs = require("fs");
const path = require("path");
const cookieparser = require("cookie-parser")
const bodyparser = require("body-parser");
const multer = require("multer");
const dotenv = require("dotenv")
dotenv.config();

const PORT = process.env.PORT;
const URL = process.env.URL;

mongoose.connect(URL).then(() => {
    console.log("Db Connected");
}).catch(err => {
    console.log(err);
})

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cookieparser());
const publicPath = path.join(__dirname, "./public");
//console.log(publicPath);
app.use('/public', express.static(publicPath));


const bookrouter = require("./router/api");
app.use("/books", bookrouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
// app.listen(PORT, () => console.log(`App listening on port ${PORT}`));