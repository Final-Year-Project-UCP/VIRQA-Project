'use client';

import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Paperclip,
  Send,
  CheckCircle,
  Mail,
  MapPin,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  MessageSquare,
  Sparkles
} from 'lucide-react';

const VIRQAContactUs = ({ user }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // 3D Tilt Logic
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const categories = [
    'Technical Issue',
    'Interview Process Question',
    'Payment / Billing',
    'Partnership Opportunity',
    'Other',
  ];

  const socialLinks = [
    { icon: <Twitter size={18} />, href: '#' },
    { icon: <Linkedin size={18} />, href: '#' },
    { icon: <Github size={18} />, href: '#' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Message sent successfully!");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6 relative overflow-hidden perspective-1000">
      <div className="max-w-8xl mx-auto">

        {/* Animated Background Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-30"
              style={{
                background: i % 2 === 0 ? '#BFDBFE' : '#E5E7EB', // Blue-200 / Gray-200
                width: Math.random() * 300 + 100,
                height: Math.random() * 300 + 100,
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
              }}
              animate={{
                y: [0, Math.random() * 100 - 50, 0],
                x: [0, Math.random() * 100 - 50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full max-w-6xl mx-auto mb-8 mt-4 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={14} />
            <span>We're here for you</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Get in <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-400">Touch</span>
          </h1>
          <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
            Have questions or suggestions? We'd love to hear from you.
          </p>
        </motion.div>

        {/* 3D Tilt Card Container */}
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative z-20 w-full max-w-6xl mx-auto"
        >
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden grid grid-cols-1 lg:grid-cols-2 transform-gpu">

            {/* Left Info Section */}
            <div className="p-8 md:p-12 bg-linear-to-br from-gray-900 to-gray-800 text-white flex flex-col justify-between relative overflow-hidden group">
              {/* Animated Grid on Hover */}
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}
              />

              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Fill up the form and our team will get back to you within 24 hours.
                </p>

                <div className="space-y-6">
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 text-gray-200"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-blue-400 backdrop-blur-sm border border-white/5">
                      <Mail size={20} />
                    </div>
                    <div>
                      <span className="block text-sm text-gray-400">Email us at</span>
                      <span className="font-semibold text-white">support@virqa.com</span>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 text-gray-200"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-blue-400 backdrop-blur-sm border border-white/5">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <span className="block text-sm text-gray-400">Visit us</span>
                      <span className="font-semibold text-white">San Francisco, CA</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="relative z-10 mt-12">
                <span className="block text-sm text-gray-400 mb-4">Follow us</span>
                <div className="flex gap-4">
                  {socialLinks.map((link, i) => (
                    <motion.a
                      key={i}
                      href={link.href}
                      whileHover={{ scale: 1.1, rotate: 5, backgroundColor: "rgba(255,255,255,0.2)" }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors"
                    >
                      {link.icon}
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Decorative Circle */}
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20 pointer-events-none" />
            </div>

            {/* Right Form Section */}
            <div className="p-8 md:p-12 bg-white/50 relative">
              <form onSubmit={handleSubmit} className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-b-2 border-gray-200 focus:border-blue-500 transition-colors outline-none font-medium text-gray-800 placeholder-gray-400"
                      placeholder="John Doe"
                      required
                    />
                  </motion.div>

                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-b-2 border-gray-200 focus:border-blue-500 transition-colors outline-none font-medium text-gray-800 placeholder-gray-400"
                      placeholder="john@example.com"
                      required
                    />
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Topic</label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-b-2 border-gray-200 focus:border-blue-500 transition-colors outline-none font-medium text-gray-800 appearance-none cursor-pointer"
                        required
                      >
                        <option value="" disabled>Select topic</option>
                        {categories.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-b-2 border-gray-200 focus:border-blue-500 transition-colors outline-none font-medium text-gray-800 placeholder-gray-400"
                      placeholder="Brief summary"
                      required
                    />
                  </motion.div>
                </div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-b-2 border-gray-200 focus:border-blue-500 transition-colors outline-none font-medium text-gray-800 placeholder-gray-400 resize-none h-32"
                    placeholder="Write your message here..."
                    required
                  />
                </motion.div>

                {/* File + Submit */}
                <motion.div
                  className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <Paperclip size={18} />
                    </div>
                    <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                      {file ? file.name : 'Attach file'}
                    </span>
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="hidden"
                    />
                  </label>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative overflow-hidden flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all ${submitted
                      ? 'bg-green-500 shadow-green-500/30'
                      : 'bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-blue-500/30'
                      }`}
                  >
                    <AnimatePresence mode='wait'>
                      {submitted ? (
                        <motion.div
                          key="submitted"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="flex items-center gap-2"
                        >
                          Message Sent <CheckCircle size={18} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="submit"
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="flex items-center gap-2"
                        >
                          Send Message <Send size={18} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>

              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VIRQAContactUs;
