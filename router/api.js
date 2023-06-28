const router = require("express").Router();
const auth = require("../middleware/auth");
const upload = require("../common");
const {AddBook,BookList,SearchBook,UpdateBook,DeleteBook,LoginBook}=require("../controller/bookcontroller");

router.post("/single", upload.single("image"), (req, res, next) => {
    //console.log(req.file);  // UPLOADED FILE DESCRIPTION RECEIVED
    //const image=req.image;
    res.send("uploaded successfully");
});

router.post("/", upload.single("image"),AddBook);
router.get("/token", auth,BookList);
router.get("/search", auth, SearchBook);
router.put("/", auth,UpdateBook);
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
router.delete("/",DeleteBook);
router.post("/login",LoginBook);


module.exports = router;