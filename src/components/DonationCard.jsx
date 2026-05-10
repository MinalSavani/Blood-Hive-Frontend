import React from 'react';

const DonationCard = ({title, image, icon, description}) => {
  return (
    <div className='backdrop-blur-lg border border-white/90 shadow-lg rounded-2xl
    flex flex-col w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-[402px] mx-auto bg-gray-200 
    transition-transform duration-700 ease-in-out transform hover:scale-105'>
      <div className='relative mt-4 sm:mt-5 mx-4 sm:mx-5'>
        <img 
          className="w-full aspect-[4/3] object-cover rounded-lg" 
          src={image} 
          alt={title}
          loading="lazy"
        />

        {/* Icon */}
        <div className='absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 md:h-[88px] md:w-[88px] bg-black rounded-full shadow-xl'>
          <img className='h-8 w-10 sm:h-10 sm:w-12 md:h-[42px] md:w-[58px] object-contain' src={icon} alt="Icon"/>
        </div>
      </div>

      <div className='flex flex-col mt-10 sm:mt-12 md:mt-14 items-center text-center px-4 sm:px-5 pb-6'>
        <h3 className='text-lg sm:text-xl font-semibold text-gray-800'>
          {title}
        </h3>
        <p className='text-sm sm:text-base text-gray-600 mt-2 leading-relaxed'>
          {description}
        </p>
      </div>
    </div>
  );
}

export default DonationCard;
