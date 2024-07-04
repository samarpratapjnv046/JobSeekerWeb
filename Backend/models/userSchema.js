import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please provide your name"],
        minLength:[3,"Name Must Contain at least 3 Character"],
        maxLength :[30,"Name Cannot exceed 30 character"]
    },
    email:{
        type:String ,
        required :[true,"PLease provide Your email"],
        validate:[validator.isEmail,"Please Provide a valid email"],

    },
    phone:{
        type:Number,
        required:[true,"Please enter your Phone number"],
    },
    password:{
        type:String,
        required:[true,"Please provide Your password"],
        minLength:[8,"Password Must Contain at least 8 Character"],
        maxLength :[32,"Password Cannot exceed 32 character"],
        select : false
    },
    role:{
        type:String,
        required:[true,"please provide your role"],
        enum:["Job Seeker","Employer"]
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
});


//HASHING THE PASSWORD 

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password =await bcrypt.hash(this.password,10);
}); 


// COMPARING PASSWORD 

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};


// GENERATING A JWT TOKEN FOR AUTHORIZATION 

userSchema.methods.geJWTToken =function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{ 
        expiresIn:process.env.JWT_EXPIRE,
    });
};


export const User = mongoose.model("User",userSchema)