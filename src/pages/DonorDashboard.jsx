import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Achievements from '../components/Achievements';
import MyCertificate from '../components/MyCertificate';
import Footer from '../components/Footer';

const DonorDashboard = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserId(user._id || user.id);
      } catch(e) {
        console.error("Error parsing user from localStorage");
      }
    }
  }, []);

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">Please log in to view your dashboard.</p>
        </div>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow max-w-6xl w-full mx-auto p-4 md:p-8 pt-24">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Donor Dashboard</h1>
        
        <MyCertificate userId={userId} />
        <Achievements userId={userId} />

      </div>
      <Footer />
    </div>
  );
};

export default DonorDashboard;
