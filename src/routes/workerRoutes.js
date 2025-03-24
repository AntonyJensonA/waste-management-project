import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

// ===== Waste Routes =====
router.get('/waste', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM waste ORDER BY id ASC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching waste:', error);
        res.status(500).json({ error: 'Failed to fetch waste' });
    }
});

router.post('/waste', async (req, res) => {
    const { day, month, year, plastic_kg, electronic_kg, bio_kg, recycle_percentage, amount } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO waste (day, month, year, plastic_kg, electronic_kg, bio_kg, recycle_percentage, amount) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [day, month, year, plastic_kg, electronic_kg, bio_kg, recycle_percentage, amount]
        );
        res.json({ id: result.insertId, message: 'Waste added successfully' });
    } catch (error) {
        console.error('Error adding waste:', error);
        res.status(500).json({ error: 'Failed to add waste' });
    }
});

router.put('/waste/:id', async (req, res) => {
    const { id } = req.params;
    const { day, month, year, plastic_kg, electronic_kg, bio_kg, recycle_percentage, amount } = req.body;
    try {
        await pool.query(
            `UPDATE waste SET day=?, month=?, year=?, plastic_kg=?, electronic_kg=?, bio_kg=?, recycle_percentage=?, amount=? WHERE id=?`,
            [day, month, year, plastic_kg, electronic_kg, bio_kg, recycle_percentage, amount, id]
        );
        res.json({ message: 'Waste updated successfully' });
    } catch (error) {
        console.error('Error updating waste:', error);
        res.status(500).json({ error: 'Failed to update waste' });
    }
});
// Get waste data for a specific date (filtered by day, month, year)
router.get('/waste/date/:day/:month/:year', async (req, res) => {
    const { day, month, year } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT * FROM waste WHERE day = ? AND month = ? AND year = ?',
            [day, month, year]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching waste by date:', error);
        res.status(500).json({ error: 'Failed to fetch waste by date' });
    }
});

// ===== Billing Routes =====
router.get('/billing', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM billing ORDER BY id ASC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching billing:', error);
        res.status(500).json({ error: 'Failed to fetch billing' });
    }
});

router.post('/billing', async (req, res) => {
    const { full_name, house_no, bill_date, bill_amount } = req.body;
  
    try {
      // Get the latest bill_no safely
      const [rows] = await pool.query(
        `SELECT bill_no FROM billing ORDER BY id DESC LIMIT 1`
      );
  
      let nextBillNo = 'BILL-00001'; // Default for first entry
  
      if (rows.length > 0 && rows[0].bill_no) {
        const lastBillNo = rows[0].bill_no;  // e.g., BILL-00023
  
        // Validate format: must contain "-"
        if (lastBillNo.includes('-')) {
          const parts = lastBillNo.split('-');  // ['BILL', '00023']
          const lastNum = parseInt(parts[1], 10);
  
          if (!isNaN(lastNum)) {
            const newNum = (lastNum + 1).toString().padStart(5, '0');
            nextBillNo = `BILL-${newNum}`;
          }
        }
      }
  
      // Insert the new billing record
      const [result] = await pool.query(
        `INSERT INTO billing (full_name, house_no, bill_no, bill_date, bill_amount)
         VALUES (?, ?, ?, ?, ?)`,
        [full_name, house_no, nextBillNo, bill_date, bill_amount]
      );
  
      res.json({ id: result.insertId, bill_no: nextBillNo, message: 'Billing record added successfully' });
  
    } catch (error) {
      console.error('Error adding billing:', error);
      res.status(500).json({ error: 'Failed to add billing' });
    }
  });
  
  
router.put('/billing/:id', async (req, res) => {
    const { id } = req.params;
    const { full_name, house_no, bill_no, bill_date, bill_amount } = req.body;
    try {
        await pool.query(
            `UPDATE billing SET full_name=?, house_no=?, bill_no=?, bill_date=?, bill_amount=? WHERE id=?`,
            [full_name, house_no, bill_no, bill_date, bill_amount, id]
        );
        res.json({ message: 'Billing record updated successfully' });
    } catch (error) {
        console.error('Error updating billing:', error);
        res.status(500).json({ error: 'Failed to update billing' });
    }
});

export default router;
