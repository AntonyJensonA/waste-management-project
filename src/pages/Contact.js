import React from 'react'
import img2 from "./images/ph.jpg"
import './Contact.css'
export const Contact = () => {
  return (
    <div className='contact-container'>
      <img src={img2}  alt="nature" />
      <div className='text'>
        <h1>Phone No</h1>
        <p>807848*****</p>
        <h1>Mailid</h1>
        <p>abcd@gmail.com</p> 
      </div>
    </div>
  )
}
