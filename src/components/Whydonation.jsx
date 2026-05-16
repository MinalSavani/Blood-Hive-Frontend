import React from "react";
import DonationCard from "./DonationCard";

const Whydonation = () => {
  const donationData = [
    {
      title: "Become a Donor",
      image: "/images/bloodgive.jpeg",
      icon: "/images/icon-1.png",
      description:
        "Every drop of blood you donate has the power to save a life. Millions of patients rely on generous donors like you for survival. Join our mission to make a difference!",
    },
    {
      title: "Why Give Blood?",
      image: "/images/test.jpeg",
      icon: "/images/icon-2.png",
      description:
        "Donations help maintain blood supply in hospitals and save lives. It supports emergency care, surgeries, and patients undergoing medical treatments.",
    },
    {
      title: "How Donations Help?",
      image: "/images/bg2.jpeg",
      icon: "/images/icon-3.png",
      description:
        "Donations help maintain blood supply in hospitals and save lives. It supports emergency care, surgeries, and patients undergoing medical treatments.",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-10 mt-16 sm:mt-20 md:mt-24 lg:mt-[120px] max-w-[1400px] mx-auto px-4 sm:px-6">
      {donationData.map((data, index) => (
        <DonationCard key={index} {...data} />
      ))}
    </div>
  );
};

export default Whydonation;