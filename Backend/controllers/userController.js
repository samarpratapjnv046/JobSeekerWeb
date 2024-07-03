import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";

export const resister = catchAsyncError(async (req, res, next) => {
    const { name, email, phone, role, password } = req.body;

    // Log the incoming request body for debugging
    console.log("Request body:", req.body);

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

    res.status(200).json({
        success: true,
        message: "User registered",
        user,
    });
    sendToken(user,200,res,"User Resister Successfully");
});


