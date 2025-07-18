import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";


export const resister = catchAsyncError(async (req, res, next) => {
    const { name, email, phone, role, password } = req.body;

    // Log the incoming request body for debugging
    // console.log("Request body:", req.body);

    if (!name || !email || !phone || !role || !password) {
        return next(new ErrorHandler("Please fill the registration form"));
    }

    const isEmail = await User.findOne({ email });

    if (isEmail) {
        return next(new ErrorHandler("Email already exists!"));
    }

    const user = await User.create({
        name,
        email,
        phone,
        role,
        password,
    });

    sendToken(user,200,res,"User Resister Successfully");
});



export const login = catchAsyncError(async(req,res,next)=>{
const {email,password,role} = req.body;
if(!email || !password || !role){
    return next(new ErrorHandler("Please provide email,password and role.",400))
}
const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid EMail or Password",400));
    }
    const isPasswordMatched =await user.comparePassword(password);
    if(!isPasswordMatched){
       return  next(new ErrorHandler("Invalid EMail or Password",400));
    }
    if(user.role !== role){
        return next(new ErrorHandler("User with this role is not found.",400));
    }
     sendToken(user, 200,res,"User Logged in successfully.");
});


// export const logout = catchAsyncError(async(req,res,next)=>{
//     res.status(201).cookie("token","",{
//         httpOnly:true,
//         expires:new Date(Date.now()),
//     }).json({
//         success:true,
//         message:"User Logged Out successfully !"
//     });
// });

export const logout = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // ✅ Required for HTTPS in production
        sameSite: "None", // ✅ Required for cross-origin
        expires: new Date(Date.now()) // 🔥 Expire immediately
    });

    res.status(200).json({
        success: true,
        message: "User Logged Out successfully!"
    });
});


export const getUser =catchAsyncError((req,res,next)=>{
    const user =req.user;
    res.status(200).json({
        success:true,
        user,
    })
});