
import React, { useState, useEffect } from 'react';
import { Mic, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Nav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState('');

  const navItems = [
    { name: 'Features', id: 'features' },
    { name: 'How-It-Works', id: 'how-it-works' },
    { name: 'Demo', id: 'demo' },
    { name: 'FAQs', id: 'faqs' },
  ];

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll + update active
  const handleClick = (id) => {
    const section = document.querySelector(`#${id}`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setActiveItem(id);
      setMobileOpen(false);
    }
  };

  // Animation Variants
  const logoVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  const navItemVariants = {
    initial: { opacity: 0, y: -10 },
    animate: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 + i * 0.1, duration: 0.4, ease: 'easeOut' },
    }),
    hover: { y: -2, transition: { duration: 0.2 } },
  };

  const mobileMenuVariants = {
    closed: { opacity: 0, height: 0 },
    open: { opacity: 1, height: 'auto' },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { type: 'spring', stiffness: 400, damping: 10 } },
    tap: { scale: 0.95 },
  };

  return (
    <>
      {/* Navbar */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-2xl border-b transition-all duration-300 ${
          scrolled ? 'bg-black/60 border-white/20' : 'border-white/10'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">

          {/* Logo */}
          <motion.div
            variants={logoVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setActiveItem('');
            }}
          >
            <motion.div
              className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20"
              whileHover={{ rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Mic className="w-5 h-5 text-white" />
            </motion.div>
            <motion.span
              className="text-xl font-bold text-white tracking-tight bg-linear-to-r from-white to-gray-300 bg-clip-text"
              whileHover={{ scale: 1.02 }}
            >
              VIRQA
            </motion.span>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, i) => (
              <motion.div
                key={item.id}
                custom={i}
                variants={navItemVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                className="relative"
              >
                <button
                  onClick={() => handleClick(item.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeItem === item.id
                      ? 'bg-white/10 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.name}
                </button>
              </motion.div>
            ))}

            <motion.div
              custom={3}
              variants={navItemVariants}
              initial="initial"
              animate="animate"
            >
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="bg-white text-gray-900 px-6 py-2.5 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-200 border border-white/20"
              >
                Login
              </motion.button>
            </motion.div>
          </div>

          {/* Mobile Toggle */}
          <motion.button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-white bg-white/10 rounded-lg backdrop-blur-sm border border-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="md:hidden bg-black/80 backdrop-blur-2xl border-t border-white/10 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-3">
                {navItems.map((item, i) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handleClick(item.id)}
                    className={`block w-full text-left px-4 py-3 rounded-xl font-medium text-lg transition-all duration-200 ${
                      activeItem === item.id
                        ? 'bg-white/10 text-white'
                        : 'text-white/90 hover:text-white hover:bg-white/5'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: i * 0.1 + 0.1, duration: 0.3 } }}
                    whileHover={{ x: 5 }}
                  >
                    {item.name}
                  </motion.button>
                ))}
                <motion.button
                  className="w-full bg-white text-gray-900 px-6 py-3.5 rounded-xl font-semibold text-lg shadow-lg hover:bg-gray-100 mt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.3 } }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Login
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Dynamic Spacer for Content Below */}
      <div
        className="h-16 md:h-16"
        style={{
          marginTop: mobileOpen ? 'auto' : '0',
          transition: 'margin-top 0.3s ease-out',
        }}
      />
    </>
  );
};

export default Nav;