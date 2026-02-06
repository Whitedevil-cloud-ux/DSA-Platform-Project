const User = require("../Models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const AuthMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({ message: "Not authorized, no token" });
        }
        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        const user = await User.findById(decoded.id).select("-password");
        if(!user){
            return res.status(401).json({ message: "User not found" });
        }
        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = AuthMiddleware;

// module.exports.userVerification = async (req, res) => {
//     const token = req.cookies.token
//     if(!token){
//         return res.json({ status: false });
//     }
//     jwt.verify(token, process.env.TOKEN_KEY, async(err, data) => {
//         if(err){
//             return res.json({ status: false });
//         }else{
//             const user = await User.findById(data.id);
//             if(user) return res.json({ status: true, user: user.username })
//             else return res.json({ status: false })
//         }
//     })
// }