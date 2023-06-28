import mongoose from "mongoose";
import express from "express";
const app = express();
app.use(express.json());
import path from "path";
import { fileURLToPath } from 'url';
import cookieparser from "cookie-parser";
import bodyparser from "body-parser";
import dotenv from "dotenv";
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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "./public");
app.use('/public', express.static(publicPath));

import apiRouter from './router/api.js';
app.use("/", apiRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
