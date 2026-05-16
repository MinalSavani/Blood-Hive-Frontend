import { useState } from "react";
import axios from "axios";

export default function VolunteerReg() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    city: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // const res = await axios.post("http://localhost:5000/api/volunteers", formData);
      const res = await axios.post("https://blood-hive-backend-1.onrender.com/api/volunteers", formData);
      alert(res.data.message);
    } catch (error) {
      console.error("Registration Error:", error.response?.data?.error || error.message);
      alert("Registration failed! Try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 py-6 sm:py-8 bg-gray-50">
      <form
        className="bg-white p-5 sm:p-6 rounded-lg shadow-lg w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-center text-red-600 mb-3 sm:mb-4">Register to Volunteer</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          className="w-full p-2.5 sm:p-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full p-2.5 sm:p-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
          onChange={handleChange}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          required
          className="w-full p-2.5 sm:p-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
          onChange={handleChange}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          required
          className="w-full p-2.5 sm:p-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          required
          className="w-full p-2.5 sm:p-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-full p-2.5 sm:p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all active:scale-[0.98]"
        >
          Register
        </button>
      </form>
    </div>
  );
}
