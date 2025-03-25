import React from 'react'
import "./About.css"
import img1 from './images/qn.jpg'
export const About = () => {
  return (
    <div className='about-container'>
      <img src={img1}  alt="question mark" />
      <div className='text'>
        <h1>About Us </h1>
        <p> This Municipal Waste Management System allows users to efficiently manage waste disposal. Users can view their billing details, including payment history, and request waste collection services for a fixed fee of ₹200. The platform streamlines communication between residents and waste management authorities, promoting cleaner neighborhoods through organized, timely waste collection.
        </p>
      </div>
      
    </div>
  )
}
