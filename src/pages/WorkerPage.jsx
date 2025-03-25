import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WorkerPage.css';
import { toast } from 'react-toastify';

const WorkerPage = () => {
  const workerName = localStorage.getItem('workerName') || 'Worker';
  const [wasteData, setWasteData] = useState([]);
  const [billingData, setBillingData] = useState([]);
  const [newWaste, setNewWaste] = useState({ day: '', month: '', year: '', plastic_kg: '', electronic_kg: '', bio_kg: '', amount: '' });
  const [newBill, setNewBill] = useState({ full_name: '', house_no: '', bill_no: '', bill_date: '', bill_amount: '' });

  // Fetch waste and billing data
  useEffect(() => {
    axios.get('http://localhost:3000/api/waste').then(res => setWasteData(res.data)).catch(() => toast.error('Waste fetch failed'));
    axios.get('http://localhost:3000/api/billing').then(res => setBillingData(res.data)).catch(() => toast.error('Billing fetch failed'));
  }, []);

  // Waste handlers
  const handleWasteChange = (e) => setNewWaste({ ...newWaste, [e.target.name]: e.target.value });

  const handleAddWaste = () => {
    const { plastic_kg, electronic_kg, bio_kg, amount } = newWaste;
    const total = parseFloat(plastic_kg) + parseFloat(electronic_kg) + parseFloat(bio_kg);
    const recycle_percentage = total > 0 ? ((parseFloat(plastic_kg) + parseFloat(electronic_kg)) / total) * 100 : 0;

    const waste = { ...newWaste, recycle_percentage, plastic_kg: parseFloat(plastic_kg), electronic_kg: parseFloat(electronic_kg), bio_kg: parseFloat(bio_kg), amount: parseFloat(amount) };
    
    axios.post('http://localhost:3000/api/waste', waste)
      .then(() => {
        toast.success('Waste added');
        setWasteData([...wasteData, waste]);
        setNewWaste({ day: '', month: '', year: '', plastic_kg: '', electronic_kg: '', bio_kg: '', amount: '' });
      }).catch(() => toast.error('Add failed'));
  };

  const handleWasteEdit = (idx, field, value) => {
    const updated = [...wasteData];
    updated[idx][field] = value;
    setWasteData(updated);
  };

  const handleWasteSave = (data) => {
    const total = parseFloat(data.plastic_kg) + parseFloat(data.electronic_kg) + parseFloat(data.bio_kg);
    data.recycle_percentage = total > 0 ? ((parseFloat(data.plastic_kg) + parseFloat(data.electronic_kg)) / total) * 100 : 0;
    axios.put(`http://localhost:3000/api/waste/${data.id}`, data)
      .then(() => toast.success('Waste updated'))
      .catch(() => toast.error('Update failed'));
  };

  // Billing handlers
  const handleBillChange = (e) => setNewBill({ ...newBill, [e.target.name]: e.target.value });

  const handleAddBill = () => {
    const bill = {
      ...newBill,
      house_no: parseInt(newBill.house_no),
      bill_amount: parseFloat(newBill.bill_amount)
    };
  
    axios.post('http://localhost:3000/api/billing', bill)
      .then(() => {
        toast.success('Bill added');
        setNewBill({ full_name: '', house_no: '', bill_no: '', bill_date: '', bill_amount: '' });
  
        // Refetch updated billing data
        axios.get('http://localhost:3000/api/billing')
          .then(res => setBillingData(res.data))
          .catch(() => toast.error('Fetch after add failed'));
      })
      .catch(() => toast.error('Add failed'));
  };
  
  

  const handleBillEdit = (idx, field, value) => {
    const updated = [...billingData];
    updated[idx][field] = value;
    setBillingData(updated);
  };

  const handleBillSave = (bill) => {
    console.log("Bill object in handleBillSave:", bill); // 🟡 Add this
    if (!bill?.id) {
      toast.error('Invalid bill ID');
      return;
    }
  
    axios.put(`http://localhost:3000/api/billing/${bill.id}`, bill)
      .then(() => toast.success('Bill updated'))
      .catch(() => toast.error('Update failed'));
  };
  const handleLogout = () => {
    // Example: Clear auth token/session data
    localStorage.removeItem('authToken');
    // Redirect to login page
    window.location.href = '/login';
  };
  
  
  return (
    <div className="worker-container">
      <h1>👷 {workerName}'s Dashboard</h1>

      {/* Waste Table */}
      <h2>♻️ Waste Tracking</h2>
      <table className="worker-table">
        <thead>
          <tr><th>Day</th><th>Month</th><th>Year</th><th>Plastic (kg)</th><th>Electronic (kg)</th><th>Bio (kg)</th><th>Recycle %</th><th>Amount</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {wasteData.map((w, idx) => (
            <tr key={w.id}>
              <td><input value={w.day} onChange={e => handleWasteEdit(idx, 'day', e.target.value)} /></td>
              <td><input value={w.month} onChange={e => handleWasteEdit(idx, 'month', e.target.value)} /></td>
              <td><input value={w.year} onChange={e => handleWasteEdit(idx, 'year', e.target.value)} /></td>
              <td><input value={w.plastic_kg} onChange={e => handleWasteEdit(idx, 'plastic_kg', e.target.value)} /></td>
              <td><input value={w.electronic_kg} onChange={e => handleWasteEdit(idx, 'electronic_kg', e.target.value)} /></td>
              <td><input value={w.bio_kg} onChange={e => handleWasteEdit(idx, 'bio_kg', e.target.value)} /></td>
              <td>{w.recycle_percentage.toFixed(2)}%</td>
              <td><input value={w.amount} onChange={e => handleWasteEdit(idx, 'amount', e.target.value)} /></td>
              <td><button onClick={() => handleWasteSave(w)}>Save</button></td>
            </tr>
          ))}
          <tr>
            <td><input name="day" value={newWaste.day} onChange={handleWasteChange} /></td>
            <td><input name="month" value={newWaste.month} onChange={handleWasteChange} /></td>
            <td><input name="year" value={newWaste.year} onChange={handleWasteChange} /></td>
            <td><input name="plastic_kg" value={newWaste.plastic_kg} onChange={handleWasteChange} /></td>
            <td><input name="electronic_kg" value={newWaste.electronic_kg} onChange={handleWasteChange} /></td>
            <td><input name="bio_kg" value={newWaste.bio_kg} onChange={handleWasteChange} /></td>
            <td>-</td>
            <td><input name="amount" value={newWaste.amount} onChange={handleWasteChange} /></td>
            <td><button onClick={handleAddWaste}>Add</button></td>
          </tr>
        </tbody>
      </table>

      {/* Billing Table */}
      <h2>💰 Billing Information</h2>
      <table className="worker-table">
        <thead>
          <tr><th>Full Name</th><th>House No</th><th>Bill No</th><th>Bill Date</th><th>Bill Amount</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {billingData.map((b, idx) => (
            <tr key={b.id}>
              <td><input value={b.full_name} onChange={e => handleBillEdit(idx, 'full_name', e.target.value)} /></td>
              <td><input value={b.house_no} onChange={e => handleBillEdit(idx, 'house_no', e.target.value)} /></td>
              <td><input value={b.bill_no} onChange={e => handleBillEdit(idx, 'bill_no', e.target.value)} /></td>
              <td><input type="date" value={b.bill_date ? b.bill_date.substring(0, 10) : ''} onChange={e => handleBillEdit(idx, 'bill_date', e.target.value)} /></td>
              <td><input value={b.bill_amount} onChange={e => handleBillEdit(idx, 'bill_amount', e.target.value)} /></td>
              <td><button onClick={() => handleBillSave(b)}>Save</button></td>
            </tr>
          ))}
          <tr>
            <td><input name="full_name" value={newBill.full_name} onChange={handleBillChange} /></td>
            <td><input name="house_no" value={newBill.house_no} onChange={handleBillChange} /></td>
            <td><input name="bill_no" value={newBill.bill_no} onChange={handleBillChange} /></td>
            <td><input type="date" name="bill_date" value={newBill.bill_date} onChange={handleBillChange} /></td>
            <td><input name="bill_amount" value={newBill.bill_amount} onChange={handleBillChange} /></td>
            <td><button onClick={handleAddBill}>Add</button></td>
          </tr>
        </tbody>
      </table>
      <div className="admin-header">
  <button className="logout-button" onClick={handleLogout}>🚪 Logout</button>
</div>
    </div>
  );
};

export default WorkerPage;
