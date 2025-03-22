import React, { useState } from 'react';
import './FormStyles.css'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const UserLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:3000/api/auth/login", { email, password });

            if (response.data.success) {
                toast.success(response.data.message || 'Login Successful');
                sessionStorage.setItem("authToken", response.data.token);
                navigate("/login/user/userpage"); // ✅ Cleaner route structure
            } else {
                toast.error(response.data.message || 'Login Failed');
            }
        } catch (error) {
            console.error("Login Error:", error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="form-container">
            <h2>User Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    required
                    autoComplete="off"
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    required
                    autoComplete="off"
                    onChange={e => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};
