import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

// POST new expense
router.post('/', async (req, res) => {
  const { date, fuel_cost, labor_cost, other_cost, total_cost, profit } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO expenses (date, fuel_cost, labor_cost, other_cost, total_cost, profit)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [date, fuel_cost, labor_cost, other_cost, total_cost, profit]
    );
    res.json({ message: 'Expenses saved successfully', id: result.insertId });
  } catch (error) {
    console.error('Error saving expenses:', error);
    res.status(500).json({ error: 'Failed to save expenses' });
  }
});

// GET expense for a specific date
router.get('/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const [rows] = await pool.query(`SELECT * FROM expenses WHERE date = ?`, [date]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

export default router;
