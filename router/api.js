import express from 'express';
const router = express.Router();
import authMiddleware from '../middleware/auth.js';
import commonModule from '../common.js';
import {AddBook,BookList,SearchBook,UpdateBook,DeleteBook,LoginBook} from "../controller/bookcontroller.js";

router.post("/books/addbook", commonModule.single("image"),AddBook);
router.get("/books/token", authMiddleware,BookList);
router.get("/books/search", authMiddleware, SearchBook);
router.put("/books/updatebook", authMiddleware,UpdateBook);
router.delete("/books/deletebook",DeleteBook);
router.post("/login",LoginBook);


export default router;