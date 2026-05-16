import React from 'react';

const Donation = () => {
  return (
    <div>
      <div className="w-full px-4 sm:px-6 md:px-10">
        {/* Section Header */}
        <div className="text-center">
          <span className="mt-4 text-red-500 text-base sm:text-lg md:text-[20px] font-semibold">
            What We Do?
          </span>
          <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-[36px] font-extrabold">Our Best Services</h2>
        </div>

        {/* Main Content Row */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-6 sm:mt-8 md:mt-10 gap-6 md:gap-8">
          {/* Left: Image Section */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img 
              className="w-full max-w-[400px] md:max-w-none h-auto md:h-[400px] lg:h-[500px] object-cover rounded-lg" 
              src="/images/about4.png" 
              alt="Blood donation process"
              loading="lazy"
            />
          </div>

          {/* Right: Text Section */}
          <div className="w-full md:w-1/2 flex flex-col px-2 sm:px-4 md:px-6 lg:px-10 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-400">01</h1>
            <h3 className="text-xl sm:text-2xl font-semibold mt-3 sm:mt-4">Blood Donation Process</h3>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
              We follow a safe and efficient process to ensure every blood donation helps save lives.
              Join us in making a difference.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Donation;
