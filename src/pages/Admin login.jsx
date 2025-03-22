import React from 'react';
import './FormStyles.css'; 

export const AdminLogin = () => {
  return (
    <div className="form-container">
      <h2>Admin Login</h2>
      <form>
        <input type="text" placeholder="Admin ID" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>   
    </div>
  );
};
