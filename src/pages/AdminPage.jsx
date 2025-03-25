import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { toast } from 'react-toastify';

const AdminPage = () => {
  const [wasteData, setWasteData] = useState([]);
  const [billingData, setBillingData] = useState([]);
  const [costData, setCostData] = useState({ fuel_cost: 0, labor_cost: 0, other_cost: 0 });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [wasteRequests, setWasteRequests] = useState([]);

  // Fetch data
  useEffect(() => {
    axios.get('http://localhost:3000/api/waste')
      .then(res => setWasteData(res.data))
      .catch(() => toast.error('Failed to fetch waste data'));

    axios.get('http://localhost:3000/api/billing')
      .then(res => setBillingData(res.data))
      .catch(() => toast.error('Failed to fetch billing data'));

    axios.get('http://localhost:3000/api/costs')
      .then(res => setCostData(res.data))
      .catch(() => toast.error('Failed to fetch cost data'));
  }, []);

  // Filtered waste data for selected date
  const filteredWasteData = wasteData.filter(w => {
    if (!selectedDate) return true;
    const selected = new Date(selectedDate);
    return (
      w.day === selected.getDate() &&
      w.month === (selected.getMonth() + 1) &&
      w.year === selected.getFullYear()
    );
  });
  
  // Filtered billing data for selected month
  const filteredBillingData = billingData.filter(b => {
    if (!b.bill_date || !selectedMonth) return true;
    const billDate = new Date(b.bill_date);
    const [year, month] = selectedMonth.split('-').map(Number);
    return billDate.getFullYear() === year && billDate.getMonth() + 1 === month;
  });

  // Waste calculations
  const totalWaste = filteredWasteData.reduce((sum, w) =>
    sum + (parseFloat(w.plastic_kg) || 0) + (parseFloat(w.electronic_kg) || 0) + (parseFloat(w.bio_kg) || 0), 0
  );

  const totalRecyclable = filteredWasteData.reduce((sum, w) =>
    sum + (parseFloat(w.plastic_kg) || 0) + (parseFloat(w.electronic_kg) || 0), 0
  );

  const totalAmount = filteredWasteData.reduce((sum, w) =>
    sum + (parseFloat(w.amount) || 0), 0
  );

  const recyclePercentage = totalWaste > 0 ? (totalRecyclable / totalWaste) * 100 : 0;

  const totalCost = (parseFloat(costData.fuel_cost) || 0) + (parseFloat(costData.labor_cost) || 0) + (parseFloat(costData.other_cost) || 0);
  const totalProfit = totalAmount - totalCost;

  const handleCostChange = (e) => {
    const { name, value } = e.target;
    setCostData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveCosts = () => {
    axios.post('http://localhost:3000/api/costs', costData)
      .then(() => toast.success('Costs updated'))
      .catch(() => toast.error('Failed to update costs'));
  };
  useEffect(() => {
    axios.get('http://localhost:3000/api/requests/waste-requests')
      .then(res => setWasteRequests(res.data))
      .catch(() => toast.error('Failed to fetch requests'));
  }, []);
  
  // Accept request
  const handleAcceptRequest = (id) => {
    axios.put(`http://localhost:3000/api/requests/accept-request/${id}`)
      .then(() => {
        toast.success('Request accepted');
        setWasteRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Accepted' } : r));
      })
      .catch(() => toast.error('Failed to accept request'));
  };
  const handleLogout = () => {
    // Example: Clear auth token/session data
    localStorage.removeItem('authToken');
    // Redirect to login page
    window.location.href = '/login';
  };
  

  return (
    <div className="admin-container">
      <h1>🏡 Admin Dashboard</h1>

      {/* Filters */}
      
        <label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value) } className="filter-container progress-bar-filters" style={{ display: 'none' }}/>
        </label>
        <div className="filter-container">
        <label>
          📆 Filter Billing by Month:
          <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} />
        </label>
      </div>

      {/* Gauges */}
      <div className="gauges-container">
        <div className="gauge-card">
          <h3>♻️ Recyclable %</h3>
          <CircularProgressbar
            value={recyclePercentage || 0}
            text={`${recyclePercentage.toFixed(1)}%`}
            styles={buildStyles({ textColor: "#0f5132", pathColor: "#198754", trailColor: "#d6d6d6" })}
          />
        </div>

        <div className="gauge-card">
          <h3>🗑️ Total Waste (kg)</h3>
          <CircularProgressbar
            value={totalWaste || 0}
            maxValue={1000}
            text={`${totalWaste.toFixed(1)} kg`}
            styles={buildStyles({ textColor: "#084298", pathColor: "#0d6efd", trailColor: "#d6d6d6" })}
          />
        </div>

        <div className="gauge-card">
          <h3>💰 Amount Gained</h3>
          <CircularProgressbar
            value={totalAmount || 0}
            maxValue={10000}
            text={`₹${totalAmount.toFixed(1)}`}
            styles={buildStyles({ textColor: "#842029", pathColor: "#dc3545", trailColor: "#d6d6d6" })}
          />
        </div>

        <div className="gauge-card">
          <h3>📊 Total Profit</h3>
          <CircularProgressbar
            value={totalProfit > 0 ? totalProfit : 0}
            maxValue={10000}
            text={`₹${totalProfit.toFixed(1)}`}
            styles={buildStyles({ textColor: "#000", pathColor: "#ffc107", trailColor: "#d6d6d6" })}
          />
        </div>
      </div>

      {/* Cost Management */}
      <div className="cost-form">
        <h2>🧾 Cost Management</h2>
        <label>Fuel Cost: ₹ <input type="number" name="fuel_cost" value={costData.fuel_cost} onChange={handleCostChange} /></label>
        <label>Labor Cost: ₹ <input type="number" name="labor_cost" value={costData.labor_cost} onChange={handleCostChange} /></label>
        <label>Other Cost: ₹ <input type="number" name="other_cost" value={costData.other_cost} onChange={handleCostChange} /></label>
        <button onClick={handleSaveCosts}>💾 Save Costs</button>
      </div>

      {/* Billing Table */}
      <h2>💵 Billing Details</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>House No</th>
            <th>Bill No</th>
            <th>Bill Date</th>
            <th>Bill Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {filteredBillingData.map((b, idx) => (
            <tr key={idx}>
              <td>{b.full_name}</td>
              <td>{b.house_no}</td>
              <td>{b.bill_no}</td>
              <td>{b.bill_date?.substring(0, 10)}</td>
              <td>₹{b.bill_amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>🗂️ Waste Collection Requests</h2>
<table className="admin-table">
  <thead>
    <tr>
      <th>Full Name</th>
      <th>House No</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {wasteRequests.map(req => (
      <tr key={req.id}>
        <td>{req.full_name}</td>
        <td>{req.house_number}</td>
        <td>{req.status}</td>
        <td>
          {req.status === 'Pending' && (
            <button onClick={() => handleAcceptRequest(req.id)}>✅ Accept</button>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>
<div className="admin-header">
  <button className="logout-button" onClick={handleLogout}>🚪 Logout</button>
</div>
    </div>
  );
};

export default AdminPage;
