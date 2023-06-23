const router = require("express").Router();
const bookModel = require("../model/bookmodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const upload = require("../common");

router.post("/single", upload.single("image"), (req, res, next) => {
    //console.log(req.file);  // UPLOADED FILE DESCRIPTION RECEIVED
    //const image=req.image;
    res.send("uploaded successfully");
});

router.post("/", upload.single("image"), async function (req, resp) {
    // console.log(req);
    const bookName = req.body.bookName;
    const autherName = req.body.autherName;
    const bookVersion = req.body.bookVersion;
    const price = req.body.price;
    const numberOfPages = req.body.numberOfPages;
    const image = req.file.filename;
    const password = req.body.password;

    const bookExist = await bookModel.findOne({ bookName: bookName });

    if (bookExist) {
        return resp.send("Book already exists");
    }
    const data = await bookModel.create({
        bookName, autherName, bookVersion, price, numberOfPages, image, password
    });
    //const userId = req.user.id;
    resp.send({
        message: "Book Updated",
        data: data
    });
})



router.get("/", auth, async (req, resp) => {
    try {
        const bookList = await bookModel.find();
        // console.log(bookList);
        resp.send(bookList);
    } catch (error) {
        console.log(error);
        resp.status(500).send("Error retrieving book list");
    }
})


router.get("/search", auth, async function (req, resp) {
    //console.log(req.query);
    const { id, name } = req.query;
    let query = {};

    if (id) {
        query = { _id: id };
        //console.log(query);
    } else if (name) {
        query = { bookName: name };
    }

    const book = await bookModel.findOne(query);

    if (!book) {
        return resp.send("Book Not Found");
    }

    resp.send(book);
})



router.put("/", auth, async function (req, resp) {
    //console.log(req);
    const id = req.query.id;
    console.log(id);
    const {
        bookName, password, autherName, bookVersion, price, numberOfPages, image
    } = req.body;

    const bookExist = await bookModel.findOne({ _id: id });

    //console.log(bookExist);

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
            image: updateField(image, bookExist.image),
            password: updateField(password, bookExist.password),
        };
        //console.log(updatedBook);

        await bookModel.updateOne(
            { _id: id },
            {
                $set: {
                    bookName: updatedBook.bookName,
                    autherName: updatedBook.autherName,
                    bookVersion: updatedBook.bookVersion,
                    price: updatedBook.price,
                    numberOfPages: updatedBook.numberOfPages,
                    image: updatedBook.image,
                    password: updatedBook.password,
                }
            }
        );
        resp.status(200).send("Book Updated");
    }
})
// router.put("/",auth,async function (req, resp) {
//     const id = req.query.id;
//     const {
//         bookName, autherName, bookVersion, price, numberOfPages,image, password
//     } = req.body;
//     const bookExist = await bookModel.findOne({ _id: id });
//     if (!bookExist) {
//         return resp.status(404).send('Book does not exist');
//     }

//     const updateField = (val, prev) => !val ? prev : val;
//     console.log(updateField);
//     const updatedBook = {
//         ...bookExist,
//         bookName: updateField(bookName, bookExist.bookName),
//         autherName: updateField(autherName, bookExist.autherName),
//         bookVersion: updateField(bookVersion, bookExist.bookVersion),
//         price: updateField(price, bookExist.price),
//         numberOfPages: updateField(numberOfPages, bookExist.numberOfPages),
//         image: updateField(image, bookExist.image),
//         password: updateField(password, bookExist.password)
//     };
//    // console.log(updatedBook);
//     if (bookName === "Invalid") {
//         return resp.status(400).send("Invalid book name");
//     } else {
//         await bookModel.updateOne({ _id: id }, {
//             $set: {
//                 bookName: updatedBook.bookName,
//                 autherName: updatedBook.autherName,
//                 bookVersion: updatedBook.bookVersion,
//                 price: updatedBook.price,
//                 numberOfPages: updatedBook.numberOfPages,
//                 image: updatedBook.image,
//                 password: updatedBook.password
//             }
//         });

//         resp.status(200).send("Book Updated");
//     }
// });

// router.put("/", auth, async function (req, resp) {
//     const id = req.query.id;
//     console.log(req);

//     if (!id) {
//        return resp.status(400).send("Invalid ID");
//     }

//     try {
//        const bookExist = await bookModel.findOne({ _id: id });
//         console.log(bookExist);
//        if (!bookExist) {
//           return resp.status(404).send("Book does not exist");
//        }

//        const {
//           bookName,autherName,bookVersion,price,numberOfPages,image,password
//        } = req.body;

//        const updateField = (val, prev) => val ? val : prev;
//        const updatedBook = {
//           ...bookExist,
//           bookName: updateField(bookName, bookExist.bookName),
//           autherName: updateField(autherName, bookExist.autherName),
//           bookVersion: updateField(bookVersion, bookExist.bookVersion),
//           price: updateField(price, bookExist.price),
//           numberOfPages: updateField(numberOfPages, bookExist.numberOfPages),
//           image: updateField(image, bookExist.image),
//           password: updateField(password, bookExist.password),
//        };
//        //console.log(updatedBook);
//        await bookModel.updateOne(
//           { _id: id },
//           {
//              $set: {
//                 bookName: updatedBook.bookName,
//                 autherName: updatedBook.autherName,
//                 bookVersion: updatedBook.bookVersion,
//                 price: updatedBook.price,
//                 numberOfPages: updatedBook.numberOfPages,
//                 image: updatedBook.image,
//                 password: updatedBook.password,
//              }
//           }
//        );

//        resp.status(200).send("Book Updated");
//     } catch (error) {
//        console.error(error);
//        resp.status(500).send("Internal Server Error");
//     }
//  });

// router.put("/", auth, async function (req, resp) {
//     const id = req.query.id;
//     console.log(req);

//     if (!id) {
//        return resp.status(400).send("Invalid ID");
//     }

//     try {
//        const bookExist = await bookModel.findOne({ _id: id });
//        console.log(bookExist);
//        if (!bookExist) {
//           return resp.status(404).send("Book does not exist");
//        }

//        const {
//           bookName, autherName, bookVersion, price, numberOfPages, image, password
//        } = req.body;

//        const updateField = (val, prev) => val ? val : prev;
//        const updatedBook = {
//           ...bookExist,
//           bookName: updateField(bookName, bookExist.bookName),
//           autherName: updateField(autherName, bookExist.autherName),
//           bookVersion: updateField(bookVersion, bookExist.bookVersion),
//           price: updateField(price, bookExist.price),
//           numberOfPages: updateField(numberOfPages, bookExist.numberOfPages),
//           image: updateField(image, bookExist.image),
//           password: updateField(password, bookExist.password),
//        };

//        if (bookName === "Invalid") {
//           return resp.status(400).send("Invalid book name");
//        } else {
//           await bookModel.updateOne(
//              { _id: id },
//              {
//                 $set: {
//                    bookName: updatedBook.bookName,
//                    autherName: updatedBook.autherName,
//                    bookVersion: updatedBook.bookVersion,
//                    price: updatedBook.price,
//                    numberOfPages: updatedBook.numberOfPages,
//                    image: updatedBook.image,
//                    password: updatedBook.password,
//                 }
//              }
//           );

//           resp.status(200).send("Book Updated");
//        }
//     } catch (error) {
//        console.error(error);
//        resp.status(500).send("Internal Server Error");
//     }
// });

router.delete("/", async function (req, resp) {
    const id = req.query.id;
    try {
        const bookExist = await bookModel.findOne({ _id: id });
        //console.log(bookExist);
        if (!bookExist) {
            return resp.send("Book Does Not Exist");
        }
        await bookModel.deleteOne({ _id: id });
        console.log("Data deleted");
        resp.send("Book Record Deleted Successfully");


    } catch (error) {
        console.log(error);
        resp.status(500).send("Failed to delete book record");
    }
})


router.post("/login", async (req, resp) => {
    try {
        const data = await bookModel.findOne({ bookName: req.body.bookName })
        if (!data) {
            resp.send("Invaild bookName and password")
        } else {
            const valid = await bcrypt.compare(req.body.password, data.password);
            if (!valid) {
                resp.send("Invaild bookName and password")

            } else {
                const token = await jwt.sign({ _id: data._id }, "thisismytokenverificatinkey");
                console.log(token);
                resp.send("auth-token : " + token)
            }
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;