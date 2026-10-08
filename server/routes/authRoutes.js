import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import protect from "../middleware/authmiddleware.js";
const router = express.Router();

// Register a new user
router.post("/signup", async (req, res) => {
    const {name, email, password, role} = req.body;

    try {
        // check if user is already exists
        const existUser = await User.findOne({email})
        if(existUser) {
            return res.status(400).json({message: "User already exists:"})
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User(
            {
                name,
                email, 
                password: hashedPassword,
                role
            });
            await newUser.save();
            res.status(201).json({message: "User created Successfully"})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Error creating user"})
    }
})

// Login a user
router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try {
        const existUser = await User.findOne({email})
        if(!existUser) {
            return res.status(400).json({message: "Invalid credentials"})
        }
        const isPasswordCorrect = await bcrypt.compare(password, existUser.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid credentials"})
        }
        const token = jwt.sign(
            {id: existUser._id, role: existUser.role},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        )
        
        // YAHI ADD KARNA HAI - user object bhi bhejo
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: existUser._id,
                name: existUser.name,
                email: existUser.email,
                role: existUser.role
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Error logging in"})
    }
})
// get user profile 
router.get("/profile", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching profile" });
    }
});
export default router