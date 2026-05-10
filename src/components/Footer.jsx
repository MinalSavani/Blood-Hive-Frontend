import React from 'react';
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-gray-300 border-t border-red-500 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-[100px] shadow-xl py-8 sm:py-10 md:py-12 mt-8 sm:mt-10 md:mt-[50px]'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
        
        {/* About Us */}
        <div className='max-w-sm'>
          <h2 className='text-xl sm:text-2xl font-semibold text-white'>
            About Us
          </h2>
          <p className='mt-2 sm:mt-3 text-sm sm:text-base text-gray-400 leading-relaxed'>
            We are dedicated to saving lives through the power of blood donation. 
            Join us in making a difference—one drop at a time.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className='text-lg sm:text-xl font-semibold text-white'>
            Quick Links
          </h3>
          <ul className='mt-2 sm:mt-3 space-y-1.5 sm:space-y-2'>
            <li>
              <Link to="/" className="text-sm sm:text-base hover:text-red-500 transition duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/featured" className="text-sm sm:text-base hover:text-red-500 transition duration-300">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contactus" className="text-sm sm:text-base hover:text-red-500 transition duration-300">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className='max-w-sm'>
          <h3 className='text-lg sm:text-xl font-semibold text-white'>
            Contact Us
          </h3>
          <p className='mt-2 sm:mt-3 text-sm sm:text-base text-gray-400'>
            Have questions or want to contribute? Get in touch with us.
          </p>
          <p className='mt-2 text-sm sm:text-base'>📞 +91 223344233</p>
          <p className='mt-1 sm:mt-2 text-sm sm:text-base'>📧 blooddonation@gmail.com</p>

          <div className='flex flex-row mt-3 space-x-3 sm:space-x-4'>
            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-red-500 text-xl sm:text-2xl transition duration-300">
              <FaFacebook />
            </a>
            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-red-500 text-xl sm:text-2xl transition duration-300">
              <FaTwitter />
            </a>
            <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-red-500 text-xl sm:text-2xl transition duration-300">
              <FaInstagram />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-red-500 text-xl sm:text-2xl transition duration-300">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-red-800 mt-6 sm:mt-8 pt-4 text-center">
        <p className="text-xs sm:text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Blood Donation | All Rights Reserved
        </p>
      </div>
    </footer>
  );
}

export default Footer;
