import { pool } from '../config/db.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = "abcdeg";

export const getBillingByUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user details
    const [userRows] = await pool.query(`SELECT full_name, house_number FROM signup WHERE email = ?`, [decoded.email]);
    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { full_name, house_number } = userRows[0];

    // Fetch billing records for this user
    const [billingRows] = await pool.query(
      `SELECT * FROM billing WHERE full_name = ? AND house_no = ?`,
      [full_name, house_number]
    );

    res.status(200).json({ success: true, data: billingRows });
  } catch (error) {
    console.error("Error fetching user billing:", error);
    res.status(500).json({ success: false, message: "Failed to fetch billing data", error: error });
  }
};
