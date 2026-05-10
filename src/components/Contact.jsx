import React from "react";

const Contact = () => {
  return (
    <div className="flex items-center justify-center py-8 sm:py-12 md:py-16 px-4 sm:px-6">
      <div className="flex flex-col w-full max-w-lg p-4 sm:p-6 md:p-8 lg:p-[50px]">
        <span className="text-base sm:text-lg md:text-[20px] my-3 sm:my-4 md:my-[20px]">
          Do you want to donate blood? Fill
        </span>

        <label htmlFor="contact-name" className="text-base sm:text-lg mt-2 sm:mt-[10px] font-semibold">
          Name
        </label>
        <input id="contact-name" type="text" className="w-full p-3 sm:p-[15px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 transition-all" />

        <label htmlFor="contact-tel" className="text-base sm:text-lg mt-2 sm:mt-[10px] font-semibold">
          Telephone
        </label>
        <input id="contact-tel" type="tel" className="w-full p-3 sm:p-[15px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 transition-all" />

        <label htmlFor="contact-email" className="text-base sm:text-lg mt-2 sm:mt-[10px] font-semibold">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          className="w-full p-3 sm:p-[15px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
          placeholder="ram@example.com"
        />

        <label htmlFor="contact-address" className="text-base sm:text-lg mt-2 sm:mt-[10px] font-semibold">
          Address
        </label>
        <input
          id="contact-address"
          type="text"
          className="w-full p-3 sm:p-[15px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
          placeholder="123 Town Street"
        />

        <label htmlFor="contact-weight" className="text-base sm:text-lg mt-2 sm:mt-[10px] font-semibold">
          Weight
        </label>
        <input id="contact-weight" type="text" className="w-full p-3 sm:p-[15px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 transition-all" placeholder="50kg" />

        <label htmlFor="contact-blood" className="text-base sm:text-lg mt-2 sm:mt-[10px] font-semibold">
          Blood Group
        </label>
        <select id="contact-blood" className="w-full p-3 sm:p-[15px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 transition-all bg-white">
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>

        <label htmlFor="contact-age" className="text-base sm:text-lg mt-2 sm:mt-[10px] font-semibold">
          Age
        </label>
        <input id="contact-age" type="number" className="w-full p-3 sm:p-[15px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 transition-all" placeholder="20" />

        <label htmlFor="contact-diseases" className="text-base sm:text-lg mt-2 sm:mt-[10px] font-semibold">
          Do you have any diseases?
        </label>
        <textarea
          id="contact-diseases"
          className="w-full p-3 sm:p-[15px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 transition-all resize-none"
          placeholder="N/A"
          rows={3}
        />

        <button className="bg-red-500 p-3 mt-4 w-full cursor-pointer text-white font-semibold rounded-md hover:bg-red-600 transition-all duration-300 active:scale-[0.98]">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Contact;
