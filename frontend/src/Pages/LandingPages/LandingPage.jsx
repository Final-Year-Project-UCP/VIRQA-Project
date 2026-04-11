'use client';
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Hero from '../../components/other/LandingPage/Hero';
import Nav from '../../components/other/LandingPage/Nav';
import Feature from '../../components/other/LandingPage/Feature';
import HowItWorks from '../../components/other/LandingPage/HowItWorks';
import DemoSection from '../../components/other/LandingPage/DemoSection';
import WhoItsFor from '../../components/other/LandingPage/WhoItsFor';
import Footer from '../../components/other/LandingPage/Footer';
import FAQSection from '../../components/other/LandingPage/FAQs';
import TermsModal from '../../components/other/LandingPage/Term&Condition';
import FinalCTA from '../../components/other/LandingPage/FinalCTA';

const LandingPage = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

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
    <div className="w-full relative bg-white selection:bg-gray-900 selection:text-white">
      <Nav />
      <Hero />
      <div id="features">
        <Feature />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="demo">
        <DemoSection />
      </div>
      <WhoItsFor />
      <div id="faqs">
        <FAQSection />
      </div>


      <Footer openTerms={() => setIsTermsOpen(true)} />

      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-10 right-10 z-[60] w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group"
          >
            <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
