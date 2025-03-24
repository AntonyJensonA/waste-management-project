import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './UserPage.css'
const UserPage = () => {
  const [userData, setUserData] = useState(null);
  const [billingData, setBillingData] = useState([]);
  const [filteredBilling, setFilteredBilling] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const billingTableRef = useRef(null);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      toast.error("No token found, please login.");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.post("http://localhost:3000/api/auth/get-user", {}, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setUserData(response.data.data);
        } else {
          toast.error("Failed to fetch user data");
        }
      } catch (error) {
        toast.error("Error fetching user data");
      }
    };

    const fetchBillingData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/billing/user", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setBillingData(response.data.data);
          setFilteredBilling(response.data.data);
        } else {
          toast.error("Failed to fetch billing data");
        }
      } catch (error) {
        toast.error("Error fetching billing data");
      }
    };

    fetchUserData();
    fetchBillingData();
  }, []);

  const handleFilterChange = () => {
    let filtered = billingData;

    if (selectedMonth !== '') {
      filtered = filtered.filter((bill) => {
        const billDate = new Date(bill.bill_date);
        return billDate.getMonth() === parseInt(selectedMonth);
      });
    }

    if (selectedYear !== '') {
      filtered = filtered.filter((bill) => {
        const billDate = new Date(bill.bill_date);
        return billDate.getFullYear().toString() === selectedYear;
      });
    }

    setFilteredBilling(filtered);
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedMonth, selectedYear, billingData]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Billing Details', 14, 16);
    doc.autoTable({
      startY: 20,
      head: [['Bill No', 'Bill Date', 'Amount (Rs)']],
      body: filteredBilling.map(bill => [
        bill.bill_no,
        new Date(bill.bill_date).toLocaleDateString(),
        bill.bill_amount
      ])
    });
    doc.save('billing_details.pdf');
  };

  // Generate unique years from billing data
  const uniqueYears = [...new Set(billingData.map((bill) =>
    new Date(bill.bill_date).getFullYear().toString()
  ))];

  return (
    <div className="user-container">
      <h1>Welcome to User Page</h1>

      {userData && (
        <div className="user-info">
          <p><strong>Full Name:</strong> {userData.full_name}</p>
          <p><strong>House Number:</strong> {userData.house_number}</p>
          <p><strong>Email:</strong> {userData.email}</p>
        </div>
      )}

      <div className="billing-card">
        <h2>Billing Details</h2>

        <div className="filter-controls">
          <label>Month:</label>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            <option value="">All</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option value={i} key={i}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>

          <label style={{ marginLeft: '20px' }}>Year:</label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="">All</option>
            {uniqueYears.map((year, idx) => (
              <option key={idx} value={year}>{year}</option>
            ))}
          </select>

          <button className="export-btn" onClick={exportPDF}>Export PDF</button>
        </div>

        {filteredBilling.length > 0 ? (
          <table className="billing-table" ref={billingTableRef}>
            <thead>
              <tr>
                <th>Bill No</th>
                <th>Bill Date</th>
                <th>Amount (Rs)</th>
              </tr>
            </thead>
            <tbody>
              {filteredBilling.map((bill) => (
                <tr key={bill.id}>
                  <td>{bill.bill_no}</td>
                  <td>{new Date(bill.bill_date).toLocaleDateString()}</td>
                  <td>{bill.bill_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No billing data found for selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default UserPage;
