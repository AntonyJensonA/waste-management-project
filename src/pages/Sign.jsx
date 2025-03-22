import React, { useState } from 'react';
import './FormStyles.css'; 
import axios from 'axios';
import { toast } from 'react-toastify';

export const Sign = () => {
  const [formValues,setFormValues]=useState({
    fullname:'',
    houseno:'',
    email:'',
    password:''
  });
  const handleInputChange=(e)=>{
    const{name,value}=e.target;
    setFormValues({...formValues,[name]:value})
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    console.log(formValues);
    try{
      const response = await axios.post("http://localhost:3000/api/auth/register-user",formValues);
      console.log(response,'res');
      if(response.data.success){
        toast.success(response.data.message || 'Registration Successful');
        setFormValues({fullname:"",houseno:"",email:"",password:""});
      }
      else{
        toast.error(response.data.message || 'Registration Failed');
      }
    }
    catch (error){
      console.error("Error during registration:",error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }

  }
  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Full Name" name='fullname' value={formValues.fullname} onChange={handleInputChange} required />
        <input type="text" placeholder="House Number" name='houseno' value={formValues.houseno} onChange={handleInputChange} required />
        <input type="email" placeholder="Email" name='email'value={formValues.email} onChange={handleInputChange} required />
        <input type="password" placeholder="Password" name='password'value={formValues.password} onChange={handleInputChange} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};