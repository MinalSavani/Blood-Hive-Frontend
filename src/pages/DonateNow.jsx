import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

const DonateNow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const quizData = location.state || {};

  const [formData, setFormData] = useState({
    name: quizData.name || "",
    email: quizData.email || "",
    phone: quizData.phone || "",
    bloodType: quizData.bloodType || "",
    age: quizData.age || "",
    weight: quizData.weight || "",
    city: quizData.city || "",
    state: quizData.state || "",
    address: quizData.address || "",
  });

  console.log("[DEBUG] Quiz data received:", quizData);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userDataStr = localStorage.getItem("user");
    if (!userDataStr) {
      navigate("/loginuser");
      return;
    }

    try {
      const user = JSON.parse(userDataStr);
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
      fetchDonorProfile(user.email);
    } catch (err) {
      console.error("Error parsing user data", err);
    }
  }, [navigate]);

  const fetchDonorProfile = async (email) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.get(
        // "http://localhost:5000/api/donation/user-profile",
        "https://blood-hive-backend-1.onrender.com/api/donation/user-profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      const userData = response.data.user;
      console.log("[DEBUG] Backend user data:", userData);
      
      // Only fill fields that are not already filled by quiz data
      setFormData((prev) => ({
        ...prev,
        phone: quizData.phone || userData.phone || "",
        bloodType: quizData.bloodType || userData.bloodType || "",
        age: quizData.age || userData.age || "",
        weight: quizData.weight || userData.weight || "",
        city: quizData.city || userData.city || "",
        state: quizData.state || userData.state || "",
        address: quizData.address || userData.address || "",
        location: quizData.location || userData.location || "",
      }));
    } catch (err) {
      console.error("Error fetching user profile:", err);
      // If profile fetch fails, use quiz data as fallback
      setFormData((prev) => ({
        ...prev,
        phone: prev.phone || quizData.phone || "",
        bloodType: prev.bloodType || quizData.bloodType || "",
        age: prev.age || quizData.age || "",
        weight: prev.weight || quizData.weight || "",
        city: prev.city || quizData.city || "",
        state: prev.state || quizData.state || "",
        address: prev.address || quizData.address || "",
      }));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
const token = localStorage.getItem("userToken");
console.log("Token:", token); // Is it null? Malformed?
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.post(
        // "http://localhost:5000/api/donation/donate-now",
        "https://blood-hive-backend-1.onrender.com/api/donation/donate-now",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSubmitted(true);
    } catch (err) {
      console.error("Donation Request Error:", err);
      setError(err.response?.data?.message || "Failed to register as donor. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (submitted) {
    return (
      <div className="flex flex-col min-h-screen relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-red-100">
        <Confetti 
          width={windowSize.width} 
          height={windowSize.height} 
          recycle={false} 
          numberOfPieces={500} 
          gravity={0.15} 
          colors={['#f87171', '#ef4444', '#dc2626', '#b91c1c', '#fca5a5', '#ffffff']}
        />
        <Navbar />
        <div className="flex-grow flex items-center justify-center relative z-10 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
            className="bg-white/80 backdrop-blur-xl p-10 sm:p-12 rounded-[2rem] shadow-2xl border border-white/60 max-w-lg w-full text-center relative overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-40 bg-gradient-to-b from-red-100/50 to-transparent opacity-50" />
            
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 12 }}
              className="w-28 h-28 mx-auto mb-8 bg-gradient-to-tr from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl shadow-red-500/30 border-4 border-white/50"
            >
              <span className="text-6xl drop-shadow-md">❤️</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight"
            >
              Thank You!
            </motion.h2>
            
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5 }}
            >
              <p className="text-xl text-gray-800 mb-2 font-medium">You are now registered as a blood donor!</p>
              <p className="text-md text-gray-500 mb-10 px-2 sm:px-6 leading-relaxed">
                Your donor profile has been created successfully. Your kindness and willingness to help will save lives.
              </p>
            </motion.div>
            
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.6 }}
            >
              <button 
                onClick={() => navigate("/dashboard")}
                className="group relative inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 font-bold text-white transition-all duration-300 bg-red-600 border border-transparent rounded-2xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 shadow-xl hover:shadow-red-600/40 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                <span className="relative z-10">Go to Dashboard</span>
                <svg className="relative z-10 w-5 h-5 ml-2 -mr-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </motion.div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-0 left-0 w-full h-64 bg-red-600/5 -z-10" />
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100"
          >
            <div className="bg-gradient-to-r from-red-600 to-red-700 py-8 px-8 sm:px-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-black opacity-10 blur-xl"></div>
              <h1 className="text-3xl sm:text-4xl font-extrabold relative z-10 tracking-tight">Become a Donor</h1>
              <p className="text-red-100 mt-2 text-lg relative z-10 font-medium">Complete your profile to register as a blood donor and save lives.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-8">
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700">
                  <p>{error}</p>
                </div>
              )}

              {/* SECTION: AUTO-FILLED DATA */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Personal Details (Auto-filled)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email} 
                      readOnly 
                      className="w-full border-gray-300 bg-gray-100 rounded-md shadow-sm p-3 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name} 
                      onChange={handleChange}
                      required
                      className="w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone} 
                      onChange={handleChange}
                      className="w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                    <input 
                      type="text" 
                      name="bloodType"
                      value={formData.bloodType} 
                      onChange={handleChange}
                      className="w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input 
                      type="number" 
                      name="age"
                      value={formData.age} 
                      onChange={handleChange}
                      className="w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                    <input 
                      type="number" 
                      name="weight"
                      value={formData.weight} 
                      onChange={handleChange}
                      className="w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input 
                      type="text" 
                      name="city"
                      value={formData.city} 
                      onChange={handleChange}
                      className="w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input 
                      type="text" 
                      name="state"
                      value={formData.state} 
                      onChange={handleChange}
                      className="w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address} 
                      onChange={handleChange}
                      className="w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500 bg-gray-50"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">*If any of the above information is incorrect or missing, please update it.</p>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
                    loading ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 hover:shadow-xl active:scale-95"
                  }`}
                >
                  {loading ? "Registering..." : "Become a Donor"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DonateNow;
