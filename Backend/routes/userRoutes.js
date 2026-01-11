import express from "express";
import { loginUser, logoutUser, registerUser, getCurrentUser } from "../controller/usercontroller.js";
import { verifyUserAuth } from "../middleware/userAuth.js";


const router = express.Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(logoutUser)
router.route("/me").get(verifyUserAuth, getCurrentUser)


export default router;