import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

if(!process.env.MONGODB_URL){
    throw new Error("MONGODB_URL is not defined");
}

async function connectDb(){
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB");
    } catch (error){
        console.log("Mongo DB Connection Error", error);
        process.exit(1);
    }
}

export default connectDb;