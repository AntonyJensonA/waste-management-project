import { pool } from "../config/db.js";

// User requests waste collection
export const createWasteRequest = async (req, res) => {
  const { full_name, house_number } = req.body;
  try {
    await pool.query("INSERT INTO waste_requests (full_name, house_number) VALUES (?, ?)", [full_name, house_number]);
    res.status(201).json({ message: "Waste collection requested" });
  } catch (err) {
    res.status(500).json({ error: "Failed to request waste collection" });
  }
};

// Admin gets all requests
export const getWasteRequests = async (req, res) => {
  try {
    const [requests] = await pool.query("SELECT * FROM waste_requests");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};

// Admin accepts request
export const acceptWasteRequest = async (req, res) => {
  const requestId = req.params.id;
  try {
    await pool.query("UPDATE waste_requests SET status='Accepted' WHERE id=?", [requestId]);
    res.json({ message: "Request accepted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to accept request" });
  }
};
