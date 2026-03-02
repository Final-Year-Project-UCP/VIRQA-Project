import bcrypt from "bcrypt";
import User from "../models/user.js";
import generateToken from "../utils/Auth.js";

const registerHandler = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullName, email, password: hashedPassword, role: role || "candidate" });
        await newUser.save();
        return res.status(201).json({ message: `${newUser.fullName} registered successfully` })

    }
    catch (error) {
        console.log("Registration Error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message || error })
    }
}

const LoginHandler = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const user = await User.findOne({ email }).select("+password"); // Need password for compare
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" })
        }
        const token = generateToken(user);
        return res.status(200).json({ message: `${user.fullName} logged in successfully`, token })
    }
    catch (error) {
        console.log("Login Error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message || error })
    }
}

export {
    registerHandler,
    LoginHandler
}