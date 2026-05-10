import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Featured from '../components/Featured';
import Contact from '../components/Contact';
import Whydonation from '../components/Whydonation';
import Footer from '../components/Footer';
import WhatWedo from '../components/WhatWedo';
import ContactUs from '../components/Services/ContactUs';
import { Element } from 'react-scroll'; 
const Home = () => {
  return (
    <div>
   <Navbar/>
   <Element name="home">
   <Hero/>
   </Element>
   <Whydonation/>
   

   <Element name="featured">
    <Featured/>
   {/* <Contact/> */}
   </Element>
  
   <WhatWedo/>
   <ContactUs/>
   <Footer/>
   
    </div>
  );
}

export default Home;
