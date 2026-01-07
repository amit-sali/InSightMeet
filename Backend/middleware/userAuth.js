import HandleError from "../utils/handleError.js";
import handleAsyncError from "./handleAsyncError.js";
import  jwt  from "jsonwebtoken";
import User from '../models/userModels.js'

export const verifyUserAuth = handleAsyncError(
    async(req,res,next)=>{
        const {token} = req.cookies;
        // console.log(token);
        if(!token){
            return next (new HandleError("Authenctication is missing ! please login to acess resource ",401))
        }
        const decodedData = jwt.verify(token,process.env.JWT_SECRET_KEY);
        // console.log(decodedData);
        req.user=await User.findById(decodedData.id);
        next();

    })
