const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");



const bookSchema = new mongoose.Schema({
    bookName: {
        type: String
    },
    autherName: {
        type: String
    },
    bookVersion: {
        type: String
    },
    price: {
        type: Number
    },
    numberOfPages: {
        type: Number
    },
    image: {
        type: String
    },
    password: {
        type: String
    },
    // Tokens:[{
    //     token:{
    //         type:String
    //     }
    // }]
})

// bookSchema.methods.generateToken=async function(){
//     try {
//         const token=await jwt.sign({_id:this._id},"thisismytokenverificatinkey");
//         this.Tokens=this.Tokens.concat({token});
//         this.save();
//         return token;
//     } catch (error) {
//         console.log(error);
//     }
// }

bookSchema.pre("save", async function (next) {
    try {
        if (this.isModified("password")) {
            this.password = await bcrypt.hash(this.password, 10);
            // console.log(password);
            next();
        }

    } catch (error) {
        console.log(error);
    }
})

module.exports = new mongoose.model("bookmodel", bookSchema);
