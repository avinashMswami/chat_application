import mongoose from "mongoose";
 
const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true,
        enum:["male","female"]
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    language:{
        type:String,
        required:true,
        default: "en"
    },
    profilePic:{
        type:String,
        default:""
    }
},{timestamps:true})

const User = mongoose.model("User",userSchema);

export default User;
