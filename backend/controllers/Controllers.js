 import User from "../models/user.model.js";
 import bcrypt from "bcryptjs";
//  import jwt from 'jsonwebtoken';
import generateTokenAndSetCookie from "../Utils/generateTokenSetCookie.js";

 export const login = async (req, res) => {
    const { userName, password } = req.body;
    
    const user = await User.findOne({ userName });
    if (!user) {
        return res.status(400).json({ error: "User does not exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: "Password is incorrect." });
    }

    // const { password: omit, ...userData } = user.toObject(); // This deletes the password from the user(temp) created above.
    const userData = user.toObject();// toObject() converts the mongoose document to normal javascript objects.
    delete userData.password;
    generateTokenAndSetCookie(userData._id,res);
    return res.status(201).json({ userData });
};


export const signup = async (req, res) => {
  try {
      const { fullName, userName, password, confirmPassword, gender, language } = req.body;

      // Validate password match
      if (password !== confirmPassword) {
          return res.status(400).json({ error: "Passwords don't match" });
      }

      // Check if all required fields are provided
      if (!fullName || !userName || !password || !confirmPassword || !gender || !language) {
          return res.status(400).json({ error: "Please provide all required fields." });
      }

      // Check if username already exists
      const user = await User.findOne({ userName });
      if (user) {
          return res.status(400).json({ error: "Username already exists" });
      }

      // Create profilePic URL based on gender
      const profilePic = (gender === "male") ? `https://avatar.iran.liara.run/public/boy?username=${userName}` : `https://avatar.iran.liara.run/public/girl?username=${userName}`;
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hasedPassword = await bcrypt.hash(password,salt);
    //   console.log(salt,hasedPassword);
      // Create a new user
      const newUser = new User({
          fullName,
          userName,
          password:hasedPassword,
          gender,
          profilePic,
          language
      });
      if(newUser){
        generateTokenAndSetCookie(newUser._id,res);
        await newUser.save();

      // Respond with the created user
      res.status(201).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          userName: newUser.userName,
          profilePic: newUser.profilePic
      });
      } else{
        res.status(400).json({error: "Invalid User Data"});
      }
  } catch (error) {
      console.log("Error in signup controller", error.message);
      res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(201).json({message: "Logged Out Sucessfully!"});
    } catch (error) {
        console.log(`Error from the logout function:${error}`);
        res.status(400).json({error: "Internal Server Error"})
    }
}