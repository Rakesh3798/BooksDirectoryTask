import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/auth.js";
import { AddBook,BookList,SearchBook,UpdateBook,DeleteBook,LoginBook,upload } from "../controller/bookcontroller.js";

router.post("/books/addbook", upload.single("image"),AddBook);
router.get("/books/booklist", authMiddleware,BookList);
router.get("/books/searchbook", authMiddleware, SearchBook);
router.put("/books/updatebook", authMiddleware,upload.single("image"),UpdateBook);
router.delete("/books/deletebook",DeleteBook);
router.post("/books/login",LoginBook);

export default router;