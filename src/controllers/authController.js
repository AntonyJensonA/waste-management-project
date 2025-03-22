import userModel from "../models/userModel.js";
import { loginUser, registerUser} from "../services/authService.js";
import { getUserFromToken as getUserFromTokenService } from "../services/authService.js";




export const register = async (req, res) => {
    const { fullname, houseno, email, password } = req.body;

    // Validation check
    if (!fullname || !houseno || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = new userModel({ fullname, houseno, email, password });

    try {
        const response = await registerUser(user); // 👈 Pass user object here
        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ success: false, message: " Try again" }); // 👈 Proper response
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const response = await loginUser(email, password);
        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(401).json(response); // Unauthorized
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, message: "Login failed, try again later" });
    }
};

export const getUserFromToken = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];  // Also fix typo in split

    if (!token) {
        return res.status(401).json({ success: false, message: "Token not provided" });
    }

    try {
        const response = await getUserFromTokenService(token);  // Call imported service function
        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(401).json(response);
        }
    } catch (error) {
        console.error("Token decoding error:", error);
        return res.status(500).json({ success: false, message: "Failed to retrieve data" });
    }
};



