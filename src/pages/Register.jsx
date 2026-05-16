import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { requestFcmToken } from "../firebase";
import Confetti from "react-confetti";

export default function Register() {
  const location = useLocation();
  const quizData = location.state || {};

  const initialForm = {
    name: quizData.name || "",
    email: quizData.email || "",
    phone: quizData.phone || "",
    bloodType: quizData.bloodType || "",
    location: quizData.location || "",
    age: quizData.age || "",
    weight: quizData.weight || "",
    role: "donor",
    fcmToken: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [winSize, setWinSize] = useState({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    const onResize = () => setWinSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setFormData(initialForm);
        setSubmitted(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  // Pre-fill email from logged-in user and make it read-only
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const { email } = JSON.parse(userData);
      setFormData(prev => ({ ...prev, email }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.age < 18 || formData.weight < 50) {
      alert("You are not eligible to donate blood.");
      return;
    }
    let fcmToken = "";
    try {
      fcmToken = await requestFcmToken() || "";
    } catch (e) { console.error("FCM token error", e); }
    try {
      // const res = await axios.post("http://localhost:5000/donors", { ...formData, fcmToken });
      const res = await axios.post("https://blood-hive-backend-1.onrender.com/donors", { ...formData, fcmToken });
      setSubmitted(true);
      console.log(res.data.message);
    } catch (error) {
      console.error("Registration Error:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Registration failed! Try again.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <Confetti width={winSize.w} height={winSize.h} recycle={false} numberOfPieces={400} />
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md mx-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Thank You, {formData.name.split(' ')[0]}!</h2>
          <p className="text-gray-600 mb-6">Your registration is complete. 🎉</p>
          <p className="text-sm text-gray-500">You will receive a push notification soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 py-6 sm:py-8 bg-gray-50">
      <form className="bg-white p-5 sm:p-6 rounded-lg shadow-lg w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-xl sm:text-2xl font-bold text-center text-red-600 mb-3 sm:mb-4">Register</h2>
        <input type="text" name="name" placeholder="Full Name" required
          className="w-full p-2.5 sm:p-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
          value={formData.name} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" required readOnly
          className="w-full p-2.5 sm:p-2 mb-0 border border-gray-300 rounded bg-gray-100 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
          value={formData.email} />
        <p className="text-sm text-gray-500 mb-3">To change email, go to your profile settings.</p>
        <input type="tel" name="phone" placeholder="Phone Number" required
          className="w-full p-2.5 sm:p-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
          value={formData.phone} onChange={handleChange} />
        <input type="text" name="bloodType" placeholder="Blood Type (if donor)"
          className="w-full p-2.5 sm:p-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
          value={formData.bloodType} onChange={handleChange} />
        <input type="text" name="location" placeholder="Location" required
          className="w-full p-2.5 sm:p-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
          value={formData.location} onChange={handleChange} />
        <input type="number" name="age" placeholder="Age" required
          className="w-full p-2.5 sm:p-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
          value={formData.age} onChange={handleChange} />
        <input type="number" name="weight" placeholder="Weight (kg)" required
          className="w-full p-2.5 sm:p-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
          value={formData.weight} onChange={handleChange} />
        <select name="role" className="w-full p-2.5 sm:p-2 mb-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-red-400 transition-all" onChange={handleChange} value={formData.role}>
          <option value="donor">Donor</option>
        </select>
        <button type="submit" className="w-full p-2.5 sm:p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all active:scale-[0.98]">
          Register
        </button>
      </form>
    </div>
  );
}
