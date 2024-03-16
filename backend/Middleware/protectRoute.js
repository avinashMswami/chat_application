import jwt from "jsonwebtoken";
import User from "../models/user.model.js"
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        // console.log("This is the token: ",token);
        // Check if token exists
        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if token is valid
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        // Find user by ID from decoded token
        const user = await User.findById(decoded.userId).select("-password");
        // console.log("This is the Sender: ",user);
        // Check if user exists
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Attach user object to request for later use
        req.user = user;

        // Call next middleware
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default protectRoute;
