import mongoose from 'mongoose'

export const dbConnection =()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName: "MER_STACK_JOB_SEEKING"
    }).then(()=>{
        console.log("Connected to DB")
    }).catch((error)=>{
        console.log("Some error occured while connecting to the database ")
    })
}