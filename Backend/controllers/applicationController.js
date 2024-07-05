import { request } from 'express';
import {catchAsyncError} from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/error.js';
import {Application} from '../models/applicaction.js';
import cloudinary from 'cloudinary';
import {Job} from '../models/jobSchema.js'




export const employerGetAllApplications = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role==="Job Seeker"){
        return (
            new ErrorHandler(
                "Job Seeker is not allowed to access this resources",
                400
            )
        );
    }
    const {_id} = req.user;
    const applications =await Application.find({'employerID.user':_id});
    res.status(200).json({
        success:true,
        applications
    })
})


export const jobSeekerAllApplications = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role==="Employer"){
        return (
            new ErrorHandler(
                "Employer is not allowed to access this resources",
                400
            )
        );
    }
    const {_id} = req.user;
    const applications =await Application.find({'applicantID.user':_id});
    res.status(200).json({
        success:true,
        applications
    })
})

export const jobSeekerDeleteApplications  = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role==="Employer"){
        return (
            new ErrorHandler(
                "Employer is not allowed to access this resources",
                400
            )
        );
    }
    const {id} =req.params;
    const application = await Application.findById(id);
    if(!application){
        return next(new ErrorHandler("Oops application not found."));
    }
    await application.deleteOne();
    res.status(200).json({
        success:true,
        message:"Application deleted Successfully!",
    })

    });


export const postApplication = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role==="Employer"){
        return (
            new ErrorHandler(
                "Employer is not allowed to access this resources",
                400
            )
        );
    }
    if(request.files|| Object.keys(req.files).length===0){
        return next(new ErrorHandler("Resume File Required"));
    }
    const {resume} =req.files;

    const allowedFormats=['image/png','image/jpg','image/webp'];
    if(!allowedFormats.includes(resume.mimetype)){
        return next(new ErrorHandler("Invalid file type.Please upload a PNG, JPG Or WEBP format.",400))
    }
    const cloudinaryResponse =await cloudinary.uploader.upload(
        resume.tempFilePath
    );
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("Cloudinary Error",cloudinaryResponse.error || "Unknown cloudinary Error");
        return next(new ErrorHandler('Failed to upload images',500))
    }
    const {name,email,coverLetter,phone,address,jobId}=req.body;

    const applicantID={
        user:req.user._id,
        role:"Job Seeker"
    };
    if(!jobId){

        return next(new ErrorHandler("Job not found !",460));
    }
    const jobDetails =await Job.findById(jobId);

    if(!jobDetails){
        return next(new ErrorHandler("Job Not Found",450))
    }

    const employerID={
        user:jobDetails.postedBy,
        role:"Employer"
    };
    if(!name || !email || !coverLetter || !phone || !address || !applicantID || !employerID || !resume ){
        return next(new ErrorHandler("Please Field all Field."));
    }

    const application = await Application.create({
        name,
        email,
        coverLetter,
        phone, 
        address,
        applicantID,
        employerID,
        resume:{
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url
        }
    });
    res.status(200).json({
        success:true,
        message:"Application Submitted ",
        application,
    })
});
