import React, { useState } from 'react';
import './FormStyles.css';
import { useNavigate } from 'react-router-dom';

export const AdminLogin = () => {
  const [adminID, setAdminID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Hardcoded credentials
    const correctAdminID = 'admin123';
    const correctPassword = 'securepass';

    if (adminID === correctAdminID && password === correctPassword) {
      // Clear error and navigate to Admin Page
      setError('');
      navigate('/login/admin/adminpage'); // Adjust this path based on your routing
    } else {
      setError('Invalid Admin ID or Password');
    }
  };

  return (
    <div className="form-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Admin ID"
          value={adminID}
          onChange={(e) => setAdminID(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};
