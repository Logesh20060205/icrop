const mongoose=require("mongoose");
const dotenv=require("dotenv");
dotenv.config();
const mongoDB=async()=>{
    try {
        const con=mongoose.connect(process.env.MONGO_URI);
        console.log("mongodb successfully connected");
    } catch (error) {
        console.log("db error",error);
    }
}
module.exports={mongoDB};