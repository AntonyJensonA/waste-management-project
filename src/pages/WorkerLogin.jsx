import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const WorkerLogin = () => {
  const [workerId, setWorkerId] = useState('');
  const [workerName, setWorkerName] = useState('');
  const navigate = useNavigate();

  // Hardcoded worker credentials (max 5 workers)
  const validWorkers = [
    { id: 'W001', name: 'Alice' },
    { id: 'W002', name: 'Bob' },
    { id: 'W003', name: 'Charlie' },
    { id: 'W004', name: 'Diana' },
    { id: 'W005', name: 'Ethan' },
  ];

  const handleLogin = (e) => {
    e.preventDefault();

    const isValid = validWorkers.some(
      (worker) => worker.id === workerId && worker.name.toLowerCase() === workerName.toLowerCase()
    );

    if (isValid) {
      toast.success('Login successful!');
      localStorage.setItem('workerName', workerName);
      navigate('/login/worker/workerpage');
    } else {
      toast.error('Invalid Worker ID or Name');
    }
  };

  return (
    <div className="login-container">
      <h2>Worker Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Worker ID"
          value={workerId}
          onChange={(e) => setWorkerId(e.target.value)}
          className="login-input"
        />
        <input
          type="text"
          placeholder="Worker Name"
          value={workerName}
          onChange={(e) => setWorkerName(e.target.value)}
          className="login-input"
        />
        <button type="submit" className="login-btn">Login</button>
      </form>
  
    </div>
  );
};

export default WorkerLogin;
