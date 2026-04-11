
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../common/Logo';

const Nav = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState('');

  const navItems = [
    { name: 'Capabilities', id: 'features' },
    { name: 'Lifecycle', id: 'how-it-works' },
    { name: 'Platform', id: 'demo' },
    { name: 'FAQs', id: 'faqs' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      // Update active item based on scroll position
      const sections = navItems.map(item => document.getElementById(item.id));
      const currentSection = sections.find(section => {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });
      if (currentSection) setActiveItem(currentSection.id);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (id) => {
    const section = document.querySelector(`#${id}`);
    if (section) {
      const offset = 80;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      setActiveItem(id);
      setMobileOpen(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled
          ? 'py-3 bg-white/70 backdrop-blur-xl border-b border-gray-200/50 shadow-sm'
          : 'py-5 bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 flex justify-between items-center">

        {/* Brand */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="cursor-pointer"
        >
          <Logo theme="dark" className="scale-105" />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-gray-100/50 p-1 rounded-full border border-gray-200/50 backdrop-blur-md">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`px-5 py-2 text-sm font-bold rounded-full transition-all duration-300 relative ${activeItem === item.id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              {activeItem === item.id && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-white shadow-sm border border-gray-200/50 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.name}</span>
            </button>
          ))}
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors px-4 py-2"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/login')}
            className="bg-gray-900 text-white px-7 py-2.5 rounded-full font-bold text-sm shadow-xl shadow-gray-200 hover:bg-black hover:scale-105 transition-all active:scale-95"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-900"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleClick(item.id)}
                  className={`block w-full text-left px-5 py-4 rounded-2xl font-bold text-lg transition-all ${activeItem === item.id ? 'bg-gray-50 text-black' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-4 grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-4 rounded-2xl border border-gray-200 font-bold text-gray-900"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-4 rounded-2xl bg-gray-900 text-white font-bold"
                >
                  Join VIRQA
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Nav;
