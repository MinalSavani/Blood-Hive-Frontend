import { Link } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="bg-[url('images/bg-3.png')] bg-no-repeat bg-cover bg-center min-h-[60vh] sm:min-h-[70vh] md:min-h-[85vh] px-4 sm:px-6 md:px-10 lg:px-20 flex flex-col pt-[80px] md:pt-[100px]">
      {/* Hero Content */}
      <div className="flex flex-col w-full md:w-[70%] lg:w-[55%] xl:w-[50%] pt-6 sm:pt-8 md:pt-[5%] lg:pt-[8%]">
        {/* Animated Subheading */}
        <motion.h3
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="text-red-600 font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl"
        >
          Donate blood, Save life!
        </motion.h3>

        {/* Animated Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="text-red-900 font-[Poppins] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mt-2 leading-tight"
        >
          Donate Blood And Inspire Others
        </motion.h1>

        <div className="flex items-center mt-6 sm:mt-8 md:mt-10 lg:mt-[50px]">
          <button className="bg-red-500 px-5 py-3 sm:px-6 sm:py-3 rounded-md text-white text-sm sm:text-base font-medium hover:bg-red-600 transition-all duration-300 hover:shadow-lg active:scale-95">
            Explore Now!
          </button>
        </div>

        {/* Cards Row */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 sm:mt-10 md:mt-14 lg:mt-[80px] w-full max-w-[700px] lg:max-w-[1000px] xl:max-w-[1200px] pb-8">
          
          {/* Donate Now Card */}
          <div className="flex flex-col font-bold w-full sm:w-1/2 py-4 px-4 sm:px-6 rounded-2xl bg-red-400 backdrop-blur-lg border border-red-800/40 shadow-lg">
            <h2 className="text-lg sm:text-xl md:text-[22px] text-white font-bold font-sans">
              Donate Now
            </h2>
            <div className="flex flex-row items-start justify-between mt-3 sm:mt-4">
              <h3 className="text-sm sm:text-[15px] text-black flex-1 mr-3">
                Join us today and make a difference! Register now to become a part of our community—because every action counts.
              </h3>
              
              {/* Clickable Icon to Navigate to Quiz Page */}
              <Link to="/quiz" className="flex-shrink-0">
                <FiLogIn className="text-4xl sm:text-5xl text-white cursor-pointer hover:text-gray-300 transition" />
              </Link>
            </div>
          </div>

          {/* Volunteer Now Card */}
          <div className="flex flex-col font-bold w-full sm:w-1/2 py-4 px-4 sm:px-6 rounded-2xl bg-red-600 backdrop-blur-lg border border-red-600/40 shadow-lg">
            <h3 className="text-lg sm:text-xl md:text-[22px] text-white font-sans">
              Volunteer Now!!
            </h3>
            <div className="flex flex-row items-start justify-between mt-3 sm:mt-4 text-sm sm:text-[15px]">
              <span className="flex-1 mr-3">
                Join us in making a difference! Your time and effort can save lives. Step up, volunteer today!
              </span>
              <Link to="/volunteer" className="flex-shrink-0">
                <FiLogIn className="text-4xl sm:text-5xl text-white cursor-pointer hover:text-gray-300 transition" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
