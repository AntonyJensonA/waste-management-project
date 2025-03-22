import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserPage = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = sessionStorage.getItem("authToken");

      if (!token) {
        toast.error("No token found, please login.");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:3000/api/auth/get-user",
          {},  // Empty body
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response:", response.data);

        if (response.data.success) {
          const user = response.data.data;
          console.log("User Data Set in State:", user);
          setUserData(user);
        } else {
          toast.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Something went wrong");
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="user-page-container">
      <h1>Welcome to User Page</h1>

      {userData ? (
        <div className="user-info">
          <p>Full Name: {userData.full_name}</p>
          <p>House Number: {userData.house_number}</p>
          <p>Email: {userData.email}</p>

        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default UserPage;
