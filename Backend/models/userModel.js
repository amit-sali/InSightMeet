import mongoose, { mongo } from "mongoose";
import validator from 'validator'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please Enter Your name"],
        maxLength: [25, "inValid Name , please Enter  a Name with fewer than 25 charaters"],
        minLength: [3, "Name Should contain more than 3 characters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your  Valid Email"],
        unique: true,
        validate: [validator.isEmail, "please Enter a Valid email"]
    },
    password: {
        type: String,
        required: [true, "Please Enter Your password"],
        minLength: [8, "Password Should be Greater than 8 characters"],
        select: false
    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, { timestamps: true })


//password hashing
userSchema.pre("save", async function (next) {
     //1 st - updating profile (name ,email,image)  - hashed password will be hashed again 

    //2nd - update password
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcryptjs.hash(this.password, 10);
    next();
})

userSchema.methods.getJWTToken = function () {
    return jwt.sign({
        id: this._id
    },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIRE
        }
    )
}
userSchema.methods.verifyPassword = async function(userEnteredPassword){
    return await bcryptjs.compare(userEnteredPassword, this.password); // should not be undefined
}



export default mongoose.model("User", userSchema)