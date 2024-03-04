 import User from "../models/user.model.js";
 
 export  const login = (req,res)=>{
    res.send("Hai Login Page")
}

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

      // Create a new user
      const newUser = new User({
          fullName,
          userName,
          password,
          gender,
          profilePic,
          language
      });

      await newUser.save();

      // Respond with the created user
      res.status(201).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          userName: newUser.userName,
          profilePic: newUser.profilePic
      });
  } catch (error) {
      console.log("Error in signup controller", error.message);
      res.status(500).json({ error: "Internal Server Error" });
  }
};


export const logout = (req,res)=>{
    res.send("Hai from logout page")
}