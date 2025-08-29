import mongoose from "mongoose" ;

export const connectDB = async(MONGO_URI)=>{
    try{
        await mongoose.connect(MONGO_URI)
        console.log("DB CONNECTED ✅");
    }catch(error){
        console.log("Databse connection error: ",error);
    };
};