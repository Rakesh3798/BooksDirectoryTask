import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/auth.js";
import { AddBook,BookList,SearchBook,UpdateBook,DeleteBook,LoginBook,upload } from "../controller/bookcontroller.js";

router.post("/books/addbook", upload.array("image",3),AddBook);
router.get("/books/booklist", authMiddleware,BookList);
router.get("/books/searchbook", authMiddleware, SearchBook);
router.put("/books/updatebook", authMiddleware,upload.single("image"),UpdateBook);
router.delete("/books/deletebook",DeleteBook);
router.post("/books/login",LoginBook);
router.post("/books/uploadImage",upload.array("image",10),(req,resp)=>{
    resp.send("Multiple Upload Image");

},(error,req,resp,next)=>{
    resp.status(400).send({error:error.message})

})
export default router;