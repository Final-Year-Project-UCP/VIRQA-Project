'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Lock, CheckCircle, XCircle, KeyRound, ShieldCheck } from 'lucide-react';
import resetBg from '../../../assets/reset_bg.png';

const ResetPassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Password strength checking
  const checkStrength = (pass) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = checkStrength(newPassword);

  const getStrengthLabel = () => {
    switch (strength) {
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Strong";
      default: return "";
    }
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 1: return "bg-red-500";
      case 2: return "bg-yellow-500";
      case 3: return "bg-blue-500";
      case 4: return "bg-emerald-500";
      default: return "bg-gray-200";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${resetBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />

      <motion.div
        className="w-full max-w-[440px] bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl p-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg text-white"
          >
            <ShieldCheck size={32} />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Reset Password</h2>
          <p className="text-gray-500 text-sm mt-2">Secure your account with a strong password</p>
        </div>

        <form className="space-y-5" onSubmit={(e) => {
          e.preventDefault();

          // Validation
          if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error('Please fill in all fields');
            return;
          }

          if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
          }

          if (strength < 3) {
            toast.error('Password is too weak. Please use a stronger password');
            return;
          }

          // Success
          toast.success('Password updated successfully!');

          // Reset form
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
        }}>

          {/* Old Password */}
          <motion.div variants={itemVariants}>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 ml-1">Current Password</label>
            <div className="relative group">
              <div className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showOld ? "text" : "password"}
                className="w-full pl-10 pr-10 py-3 bg-white/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-300 placeholder-gray-400 text-gray-700"
                placeholder="Enter current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowOld(!showOld)}
              >
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </motion.div>

          {/* New Password & Strength */}
          <motion.div variants={itemVariants}>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 ml-1">New Password</label>
            <div className="relative group">
              <div className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <KeyRound size={18} />
              </div>
              <input
                type={showNew ? "text" : "password"}
                className="w-full pl-10 pr-10 py-3 bg-white/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-300 placeholder-gray-400 text-gray-700"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Strength Meter */}
            <AnimatePresence>
              {newPassword && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-2 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-1 px-1">
                    <span className="text-[10px] uppercase font-bold text-gray-400">Strength</span>
                    <span className={`text-[10px] uppercase font-bold transition-colors duration-300 ${strength === 1 ? "text-red-500" :
                      strength === 2 ? "text-yellow-600" :
                        strength === 3 ? "text-blue-500" :
                          strength === 4 ? "text-emerald-600" : "text-gray-400"
                      }`}>
                      {getStrengthLabel()}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${getStrengthColor()}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(strength / 4) * 100}%` }}
                      transition={{ duration: 0.5, ease: "circOut" }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Confirm Password */}
          <motion.div variants={itemVariants}>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 ml-1">Confirm Password</label>
            <div className="relative group">
              <div className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <CheckCircle size={18} />
              </div>
              <input
                type={showConfirm ? "text" : "password"}
                className={`w-full pl-10 pr-10 py-3 bg-white/60 border rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all duration-300 placeholder-gray-400 text-gray-700 ${confirmPassword && newPassword !== confirmPassword
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:border-blue-500"
                  }`}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {confirmPassword && newPassword !== confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs text-red-500 mt-1.5 ml-1 flex items-center gap-1.5 font-medium"
                >
                  <XCircle size={12} /> Passwords do not match
                </motion.p>
              )}
              {confirmPassword && newPassword === confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs text-emerald-600 mt-1.5 ml-1 flex items-center gap-1.5 font-medium"
                >
                  <CheckCircle size={12} /> Passwords match
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full py-3.5 rounded-xl text-white font-semibold text-sm tracking-wide shadow-lg shadow-blue-500/30
                transition-all duration-300
                ${!oldPassword || !newPassword || newPassword !== confirmPassword
                  ? "bg-gray-400 cursor-not-allowed shadow-none opacity-70"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-600/40 hover:from-blue-500 hover:to-indigo-500"}
              `}
              disabled={!oldPassword || !newPassword || newPassword !== confirmPassword}
            >
              Update Password
            </motion.button>
          </motion.div>

        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
