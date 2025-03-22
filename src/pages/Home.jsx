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
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, consequuntur fugit pariatur dicta vitae qui animi, iure unde alias error tempore ab inventore. Nostrum inventore quam id commodi sit, itaque dicta voluptatum in culpa amet eveniet, repellat ea, blanditiis nemo distinctio ipsa quibusdam modi esse?</p>
        <button><Link to="/login" className='login-button'>Login/SignUp</Link></button>
      </div>
      
    </div>
  )
}
