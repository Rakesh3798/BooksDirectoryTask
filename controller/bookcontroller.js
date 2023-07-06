import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import bookModel from "../model/book.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { assert } from "console";
import exp from "constants";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/profile')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now() +'.jpg') 
  }
})   
export const upload = multer({ storage: storage })

export const AddBook = async function (req, resp) {
    const bookName = req.body.bookName;
    const autherName = req.body.autherName;
    const bookVersion = req.body.bookVersion;
    const price = req.body.price;
    const numberOfPages = req.body.numberOfPages; 
    const images = req.files.map(file => file.filename); // multiple upload image
    const password = req.body.password;
    const bookExist = await bookModel.findOne({ bookName: bookName });
    if (bookExist) {
        return resp.send("Book already exists");
    }
    const data = await bookModel.create({
        bookName, autherName, bookVersion, price, numberOfPages, images, password
    });
    resp.send({
        message: "Book Updated",
        data: data
    });
}

export const BookList = async (req, resp) => {
    try {
        const bookList = await bookModel.find();
        resp.send(bookList);  
    } catch (error) {
        console.log(error);
        resp.status(500).send("Error retrieving book list");
    }
}

export const SearchBook = async function (req, resp) {
    const { id, name } = req.query;
    let query = {};
    if (id) {
        query = { _id: id };
    } else if (name) {
        query = { bookName: name };
    }
    const book = await bookModel.findOne(query);
    if (!book) {
        return resp.send("Book Not Found");
    }
    resp.send(book);
}

export const UpdateBook = async function (req, resp) {
    const id = req.query.id;
    const {
        bookName, autherName, bookVersion, price, numberOfPages, images, password,
    } = req.body;
    const bookExist = await bookModel.findOne({ _id: id });
    if (!bookExist) {
        return resp.send("Book is a Exist");
    } else {
        const updateField = (val, prev) => !val ? prev : val;
        const updatedBook = {
            ...bookExist,
            bookName: updateField(bookName, bookExist.bookName),
            autherName: updateField(autherName, bookExist.autherName),
            bookVersion: updateField(bookVersion, bookExist.bookVersion),
            price: updateField(price, bookExist.price),
            numberOfPages: updateField(numberOfPages, bookExist.numberOfPages),
            images: updateField(images, bookExist.images),
            password: updateField(password, bookExist.password),
        };
        await bookModel.updateOne(
            { _id: id },
            {
                $set: {
                    bookName: updatedBook.bookName,
                    autherName: updatedBook.autherName,
                    bookVersion: updatedBook.bookVersion,
                    price: updatedBook.price,
                    numberOfPages: updatedBook.numberOfPages,
                    //images:req.file.filename,
                    images : req.files.map(file => file.filename), // multiple upload image

                    password: updatedBook.password,
                }
                
            });
        fs.unlinkSync(path.join(__dirname, `../public/profile/${bookExist.images}`));
        resp.status(200).send("Book Updated");
    }
}

export const DeleteBook = async function (req, resp) {
    const id = req.query.id;
    try {
        const bookExist = await bookModel.findOne({ _id: id });
        if (!bookExist) {
            return resp.send("Book Does Not Exist");
        }
        await bookModel.deleteOne({ _id: id });
        const images = bookExist.images;
        console.log("Images to be deleted:", images);
        for (const imageName of images) {
            const imagePath = path.join(__dirname, `../public/profile/${imageName}`);
            console.log("Deleting file:", imagePath);
            fs.unlinkSync(imagePath);
        }
        console.log("Data deleted");
        resp.send("Book Record Deleted Successfully"); 
    } catch (error) {
        console.log(error);
        resp.status(500).send("Failed to delete book record");
    }
}

export const LoginBook = async (req, resp) => {
    try {
        const data = await bookModel.findOne({ bookName: req.body.bookName })
        if (!data) {
            resp.send("Invaild bookName and password")
        } else {
            const valid = await bcrypt.compare(req.body.password, data.password);
            if (!valid) {
                resp.send("Invaild bookName and password")
                } else {
                const token = await jwt.sign({ _id: data._id }, "SEY_KEY");
                console.log(token);
                resp.send("auth-token : " + token)
            }
        }
    } catch (error) {
        console.log(error);
    }
}