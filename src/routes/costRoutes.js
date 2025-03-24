import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

// GET latest expense (for frontend)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM expenses ORDER BY date DESC LIMIT 1`);
    if (rows.length > 0) {
      const { fuel_cost, labor_cost, other_cost } = rows[0];
      res.json({ fuel_cost, labor_cost, other_cost });
    } else {
      res.json({ fuel_cost: 0, labor_cost: 0, other_cost: 0 });
    }
  } catch (error) {
    console.error('Error fetching latest expense:', error);
    res.status(500).json({ error: 'Failed to fetch cost data' });
  }
});

router.post('/', async (req, res) => {
    try {
      const { fuel_cost, labor_cost, other_cost } = req.body;
      console.log('Received cost data:', req.body);
  
      if (fuel_cost === undefined || labor_cost === undefined || other_cost === undefined) {
        return res.status(400).json({ error: 'Missing cost values' });
      }
  
      const total_cost = parseFloat(fuel_cost) + parseFloat(labor_cost) + parseFloat(other_cost);
      const date = new Date().toISOString().slice(0, 10);
  
      const [wasteRows] = await pool.query(
        `SELECT SUM(amount) as total_amount FROM waste`
      );
  
      const total_amount = wasteRows[0].total_amount || 0;
      const profit = total_amount - total_cost;
  
      const [result] = await pool.query(
        `INSERT INTO expenses (date, fuel_cost, labor_cost, other_cost, total_cost, profit)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [date, fuel_cost, labor_cost, other_cost, total_cost, profit]
      );
  
      res.json({ message: 'Expenses saved successfully', id: result.insertId });
  
    } catch (error) {
      console.error('Error saving expenses:', error);
      res.status(500).json({ error: 'Failed to save expenses', details: error.message });
    }
  });
  

// GET expense for specific date (optional)
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
