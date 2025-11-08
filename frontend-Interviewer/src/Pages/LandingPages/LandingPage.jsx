'use client';
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Hero from './components/Hero';
import Nav from './components/Nav';
import Feature from './components/Feature';
import HowItWorks from './components/HowItWorks';
import DemoSection from './components/DemoSection';
import WhoItsFor from './components/WhoItsFor';
import Footer from './components/Footer';
import FaqSection from './components/FAQs';

const LandingPage = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div>
        <Nav />
        <Hero />
        <Feature />
        <HowItWorks />
        <DemoSection />
        <WhoItsFor />
        <FaqSection />
        <Footer />
      </div>

   
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ 
              duration: 0.4, 
              ease: 'easeOut',
              type: 'spring',
              stiffness: 300,
              damping: 20
            }}
            onClick={scrollToTop}
            className="
              fixed bottom-8 right-8 z-50 
              flex items-center justify-center 
              w-14 h-14 
              bg-black/80 backdrop-blur-xl 
              border border-white/20 
              rounded-full 
              shadow-2xl 
              cursor-pointer 
              group 
              overflow-hidden
              transition-all duration-300
            "
            whileHover={{ 
              scale: 1.15,
              boxShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
            }}
            whileTap={{ scale: 0.95 }}
          >
     
            <div className="absolute inset-0 rounded-full bg-linear-to-tr from-white/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
              className="relative z-10"
            >
              <ArrowUp className="w-6 h-6 text-white drop-shadow-md" />
            </motion.div>

         
            <motion.div
              className="absolute inset-0 rounded-full border border-white/30"
              animate={{ 
                scale: [1, 1.4], 
                opacity: [0.5, 0] 
              }}
              transition={{ 
                duration: 1.8, 
                repeat: Infinity, 
                ease: 'easeOut' 
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default LandingPage;