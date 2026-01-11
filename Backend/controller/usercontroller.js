import { configDotenv } from "dotenv";
import handleAsyncError from "../middleware/handleAsyncError.js";
import User from '../models/userModel.js'
import HandleError from "../utils/handleError.js";
import { sendToken } from "../utils/jwtToken.js";

//REGISTER USER
export const registerUser = handleAsyncError(async (req, res, next) => {
    console.log('Registration request received:', req.body);
    
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return next(new HandleError("All fields are required", 400));
    }
    
    try {
        const user = await User.create({
            name,
            email,
            password
        });
        
        console.log('User created successfully:', user._id);
        sendToken(user, 200, res);
    } catch (error) {
        console.error('Registration error:', error);
        return next(new HandleError(error.message, 400));
    }
});


//LOGIN USER
export const loginUser = handleAsyncError(async (req, res, next) => {
    console.log('Login request received:', req.body);
    
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new HandleError("email or password can not be empty", 400));
    }
    
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new HandleError("inValid email or password", 401));
    }

    const isPasswordValid = await user.verifyPassword(password);

    if (!isPasswordValid) {
        return next(new HandleError("inValid email or password", 401));
    }

    sendToken(user, 200, res);
});

//LOGOUT USER

export const logoutUser = handleAsyncError(async (req, res, next) => {
    res.cookie('token',null,{
    expires : new Date(Date.now()),
    httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"successfully logged out"
    }) 
})

//GET CURRENT USER (for auth check)
export const getCurrentUser = handleAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    });
});





