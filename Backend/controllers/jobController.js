
import {catchAsyncError} from '../middlewares/catchAsyncError.js';

import ErrorHandler from '../middlewares/error.js';

import {Job} from '../models/jobSchema.js';

export const getAllJobs =catchAsyncError(async(req,res,next)=>{
    const jobs =await Job.find({expired:false});
    res.status(200).json({
        success:true,
        jobs,
    });
});


export const postJob =catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role==="Job Seeker"){
        return next(
            new ErrorHandler(
                "Job Seeker not allowed to access this resources!"
            ,400
        )
    );
    }
    const {
        title,
        description,
        category,
        country,
        city,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo,
        
    } =req.body;

    if(!title || !description || !category || !country ||   !city || !location){
        return next(new ErrorHandler("Please provide full job details",400));
    }
    if((!salaryFrom || !salaryTo) && !fixedSalary){
        return next(new ErrorHandler('Please either provide Fixed salary  or range salary '));
    }
    if(salaryFrom && salaryTo && fixedSalary){
        return next(new ErrorHandler('CanNot enter fixed salary and range salary together'));
    }
    const postedBy =req.user._id;
    const job =await Job.create({
        title,
        description,
        category,
        country,
        city,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo,
        postedBy
    })

    res.status(200).json({
        success:true,
        message:"Job Posted Successfully"
    });


});