import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    bookName: {
        type: String,
        require:true
    },
    autherName: {
        type: String,
        require:true
    },
    bookVersion: {
        type: String,
        require:true
    },
    price: {
        type: Number,
        require:true
    },
    numberOfPages: {
        type: Number,
        require:true
    },
    images: {
        type: [String],
        required: true
    },
    password: {
        type: String,
        require:true
    },
})

bookSchema.pre("save", async function (next) {
    try {
        if (this.isModified("password")) {
            this.password = await bcrypt.hash(this.password, 10);
            next();
        }
    } catch (error) {
        console.log(error);
    }
})
const bookModel = mongoose.model("book", bookSchema);
export default bookModel