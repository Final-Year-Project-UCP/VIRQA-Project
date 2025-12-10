'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, CheckCircle, XCircle } from 'lucide-react';

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
      default: return "Too Weak";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-6">

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          Reset Password
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Update your account password securely
        </p>

        {/* OLD PASSWORD */}
        <div className="mb-5">
          <label className="text-sm font-medium text-gray-700">Old Password</label>
          <div className="relative mt-1">
            <input
              type={showOld ? "text" : "password"}
              placeholder="Enter old password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setShowOld(!showOld)}
            >
              {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* NEW PASSWORD */}
        <div className="mb-5">
          <label className="text-sm font-medium text-gray-700">New Password</label>
          <div className="relative mt-1">
            <input
              type={showNew ? "text" : "password"}
              placeholder="Enter new password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* PASSWORD STRENGTH */}
          <div className="mt-2">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  strength === 1 ? "bg-red-500 w-1/4" :
                  strength === 2 ? "bg-yellow-500 w-2/4" :
                  strength === 3 ? "bg-blue-500 w-3/4" :
                  strength === 4 ? "bg-green-600 w-full" :
                  "bg-gray-300 w-1/6"
                }`}
              ></div>
            </div>
            <p className="text-xs font-medium mt-1 text-gray-600">
              Strength: {getStrengthLabel()}
            </p>
          </div>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700">Confirm Password</label>
          <div className="relative mt-1">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <XCircle size={14} /> Passwords do not match
            </p>
          )}

          {confirmPassword && newPassword === confirmPassword && (
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <CheckCircle size={14} /> Passwords match
            </p>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          className="
            w-full bg-blue-600 text-white py-2.5 
            rounded-lg text-sm font-medium 
            hover:bg-blue-700 transition disabled:opacity-60
          "
          disabled={!oldPassword || !newPassword || newPassword !== confirmPassword}
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
