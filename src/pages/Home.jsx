import React from 'react';
import "./Home.css";
import img from './images/home2.jpg' 
import { Link } from 'react-router-dom';


export const Home = () => {
  return (
    <div className='home-container'>
      <img src={img}  alt="nature" />
      <div className='text'>
        <h1>We create a Sustainable Nature</h1>
        <p>Clean streets, green future! Manage your waste smartly with our system—track bills, request pickups for just ₹200, and contribute to a cleaner, healthier neighborhood. Say goodbye to delays and hello to efficiency. Waste less, live more. Join the smart way to keep your community fresh, organized, and eco-friendly today!</p>
        <button><Link to="/login" className='login-button'>Login/SignUp</Link></button>
      </div>
      
    </div>
  )
}
