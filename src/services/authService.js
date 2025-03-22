import bcrypt from "bcryptjs";
import { pool } from '../config/db.js';
import jwt from "jsonwebtoken";

const JWT_SECRET = "abcdeg";

export const registerUser = async (user) => {
    console.log(user);
    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const query = `INSERT INTO signup (full_name, house_number, email, password) VALUES (?, ?, ?, ?)`;
        const values = [user.fullname, user.houseno, user.email, hashedPassword];

        await pool.query(query, values);
        return { success: true, message: "User Registered Successfully" };
    } catch (error) {
        return { success: false, message: "Failed, try again", error: error };
    }
};

export const loginUser = async (email, password) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM signup WHERE email = ?`, [email]);

        if (rows.length === 0) {
            return { success: false, message: "User Not found" };
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return { success: false, message: "Invalid Password" };
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return {
            success: true,
            message: 'Login Successful',
            token: token
        };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "Login failed", error: error };
    }
};

export const getUserFromToken = async (token) => {
    try {
        const trimmedToken = token.trim();
        const decodedToken = jwt.verify(trimmedToken, JWT_SECRET);

        const [rows] = await pool.query(
            `SELECT id, full_name, house_number, email FROM signup WHERE email = ?`,
            [decodedToken.email]
        );

        if (rows.length === 0) {
            return { success: false, message: "User Not found" };
        }

        return { success: true, data: rows[0] };
    } catch (error) {
        console.error("Token verification error:", error);
        return { success: false, message: "Invalid Token", error: error };
    }
};
