import React, { useState } from "react";
import axios from "axios";

const ContactUs = () => {
  // State for Form Data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/contact", formData);

      alert(res.data.message); // Show success message
      setFormData({ firstName: "", lastName: "", email: "", message: "" }); // Clear form
    } catch (error) {
      console.error("Error:", error.response?.data?.error || error.message);
      alert("Failed to send message! Try again.");
    }
  };

  return (
    <div className="bg-gray-100 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-[100px] shadow-xl py-8 sm:py-10 md:py-12 mt-8 sm:mt-10 md:mt-[60px] rounded-lg mx-4 sm:mx-6 md:mx-0">
      <div className="flex flex-col md:flex-row justify-between gap-6 sm:gap-8 md:gap-10">
        {/* Left Section */}
        <div className="w-full md:max-w-md">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">📞 Get In Touch</h1>
          <p className="text-gray-600 mt-3 sm:mt-4 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed">
            Have questions? Feel free to reach out, and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-md w-full max-w-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              aria-label="First Name"
              className="bg-gray-50 h-[48px] sm:h-[50px] px-4 border border-gray-300 rounded-md 
                         text-gray-800 font-medium focus:outline-none focus:ring-2 
                         focus:ring-red-400 placeholder-gray-500 transition-all duration-300"
            />

            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              aria-label="Last Name"
              className="bg-gray-50 h-[48px] sm:h-[50px] px-4 border border-gray-300 rounded-md 
                         text-gray-800 font-medium focus:outline-none focus:ring-2 
                         focus:ring-red-400 placeholder-gray-500 transition-all duration-300"
            />
          </div>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            aria-label="Email Address"
            className="bg-gray-50 h-[48px] sm:h-[50px] w-full px-4 border border-gray-300 rounded-md 
                       text-gray-800 font-medium focus:outline-none focus:ring-2 
                       focus:ring-red-400 placeholder-gray-500 transition-all duration-300 mt-3 sm:mt-4"
          />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            aria-label="Your Message"
            className="bg-gray-50 h-[100px] sm:h-[120px] w-full px-4 py-2 border border-gray-300 rounded-md 
                       text-gray-800 font-medium focus:outline-none focus:ring-2 
                       focus:ring-red-400 placeholder-gray-500 transition-all duration-300 mt-3 sm:mt-4 resize-none"
          ></textarea>

          <button
            type="submit"
            className="mt-4 sm:mt-6 w-full bg-red-500 text-white font-semibold py-3 rounded-md 
                       hover:bg-red-600 transition-all duration-300 active:scale-[0.98]"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
