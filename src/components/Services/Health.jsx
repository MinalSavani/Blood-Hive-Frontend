import React from 'react';

const Health = () => {
  return (
    <div>
      <div className="w-full px-4 sm:px-6 md:px-10">
        {/* Main Content Row — reversed order on mobile (text first, image second) */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between mt-6 sm:mt-8 md:mt-10 gap-6 md:gap-8">
          {/* Left: Text Section */}
          <div className="w-full md:w-1/2 flex flex-col px-2 sm:px-4 md:px-6 lg:px-10 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-500">02</h1>
            <h3 className="text-xl sm:text-2xl font-semibold mt-3 sm:mt-4">Health Check</h3>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-400 leading-relaxed">
              We follow a safe and efficient process to ensure every blood donation helps save lives.
              Join us in making a difference.
            </p>
          </div>

          {/* Right: Image Section */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img 
              className="w-full max-w-[400px] md:max-w-none h-auto md:h-[400px] lg:h-[500px] object-cover rounded-lg" 
              src="images/s2.jpeg" 
              alt="Health check process"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Health;
