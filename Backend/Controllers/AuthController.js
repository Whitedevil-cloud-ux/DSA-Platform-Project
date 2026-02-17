const User = require("../Models/User");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcrypt");

module.exports.signup = async (req, res, next) => {
    try{
        const { email, password, username, createdAt } = req.body;
        if(!email || !password || !username){
            res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(409).json({ message: "User already exists"});
        }
        const user = await User.create({ email, password, username, createdAt });
        const token = createSecretToken(user._id);
        res.status(201).json({message: "User signed up successfully", token, 
            user : {
            id: user._id,
            email: user.email,
            username: user.username,
        } 
        });
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Server errror" });
    }
};

module.exports.login = async (req, res, next) => {
    try{
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if(!user){
            return res.status(401).json({ message: "Incorrect email or password" });
        }
        const auth = await bcrypt.compare(password, user.password);
        if(!auth){
            return res.status(401).json({ message: "Incorrect email or password" });
        }
        const token = createSecretToken(user._id);
        
        res.status(201).json({ message: "User logged in successfully", token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
            }
         });
    }catch (error){
        console.error(errror);
        res.status(500).json({ message: "Server error" });
    }
}