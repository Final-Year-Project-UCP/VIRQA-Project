import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, CheckCircle, XCircle, KeyRound, ShieldCheck } from 'lucide-react';
import Logo from '../../components/common/Logo.jsx';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../config/api.js';

const VerifyOTPAndResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    // OTP State
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const otpRefs = useRef([]);

    // Password State
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // UI State
    const [isLoading, setIsLoading] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    // Redirect if no email
    useEffect(() => {
        if (!email) {
            toast.error('Please start from the forgot password page');
            navigate('/forget-password');
        }
    }, [email, navigate]);

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

    // OTP Input Handlers
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
        setOtp(newOtp);
        otpRefs.current[Math.min(pastedData.length, 5)]?.focus();
    };

    const verifyOtpMutation = useMutation({
        mutationFn: async (otpCode) => {
            const res = await api.post('/user/verify-otp', { email, otp: otpCode });
            return res.data;
        },
        onSuccess: () => {
            toast.success('OTP verified successfully!');
            setOtpVerified(true);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || err.message || 'Failed to verify OTP. Please try again.');
        }
    });

    const handleVerifyOtp = () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            toast.error('Please enter the complete 6-digit OTP');
            return;
        }

        verifyOtpMutation.mutate(otpCode);
    };

    const resetPasswordMutation = useMutation({
        mutationFn: async (passwordStr) => {
            const otpCode = otp.join('');
            const res = await api.post('/user/reset-password', { email, otp: otpCode, newPassword: passwordStr });
            return res.data;
        },
        onSuccess: () => {
            toast.success('Password reset successfully!');
            setTimeout(() => navigate('/login'), 1500);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || err.message || 'Failed to reset password. Please try again.');
        }
    });

    const handleResetPassword = (e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            toast.error('Please fill in all password fields');
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

        resetPasswordMutation.mutate(newPassword);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col justify-center items-center relative overflow-hidden font-sans">
            {/* Animated Grid */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}
            />

            {/* Decorative Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md relative z-10 px-4"
            >
                {/* Logo */}
                <div className="mb-8 flex justify-center">
                    <Logo theme="light" className="scale-125" />
                </div>

                {/* Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg text-white"
                        >
                            <ShieldCheck size={32} />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            {otpVerified ? 'Reset Password' : 'Verify OTP'}
                        </h2>
                        <p className="text-gray-400 text-sm mt-2">
                            {otpVerified
                                ? 'Enter your new password'
                                : `We sent a code to ${email}`}
                        </p>
                    </div>

                    {!otpVerified ? (
                        /* OTP Verification Section */
                        <div className="space-y-6">
                            {/* OTP Input */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3 text-center">
                                    Enter 6-Digit Code
                                </label>
                                <div className="flex gap-2 justify-center">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={el => otpRefs.current[index] = el}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            onPaste={index === 0 ? handleOtpPaste : undefined}
                                            className="w-12 h-14 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Verify Button */}
                            <button
                                onClick={handleVerifyOtp}
                                disabled={verifyOtpMutation.isPending || otp.join('').length !== 6}
                                className={`w-full py-3.5 px-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${verifyOtpMutation.isPending || otp.join('').length !== 6
                                    ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                                    : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-500/30 hover:scale-[1.02]'
                                    }`}
                            >
                                {verifyOtpMutation.isPending ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Verifying...</span>
                                    </div>
                                ) : (
                                    'Verify OTP'
                                )}
                            </button>

                            {/* Resend Code */}
                            <div className="text-center">
                                <button className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors">
                                    Resend Code
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Password Reset Section */
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            {/* New Password */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                                    New Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                        <KeyRound size={18} />
                                    </div>
                                    <input
                                        type={showNew ? "text" : "password"}
                                        className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-300 placeholder-gray-500 text-white"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-300 transition-colors"
                                        onClick={() => setShowNew(!showNew)}
                                    >
                                        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                {/* Strength Meter */}
                                {newPassword && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
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
                                        <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                                            <motion.div
                                                className={`h-full ${getStrengthColor()}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(strength / 4) * 100}%` }}
                                                transition={{ duration: 0.5, ease: "circOut" }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5 ml-1">
                                    Confirm Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                        <CheckCircle size={18} />
                                    </div>
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        className={`w-full pl-10 pr-10 py-3 bg-white/5 border rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all duration-300 placeholder-gray-500 text-white ${confirmPassword && newPassword !== confirmPassword
                                            ? "border-red-500/50 focus:border-red-500"
                                            : "border-white/10 focus:border-blue-500"
                                            }`}
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-300 transition-colors"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                    >
                                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                {/* Match Indicator */}
                                {confirmPassword && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`text-xs mt-1.5 ml-1 flex items-center gap-1.5 font-medium ${newPassword === confirmPassword ? 'text-emerald-400' : 'text-red-400'
                                            }`}
                                    >
                                        {newPassword === confirmPassword ? (
                                            <><CheckCircle size={12} /> Passwords match</>
                                        ) : (
                                            <><XCircle size={12} /> Passwords do not match</>
                                        )}
                                    </motion.p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={resetPasswordMutation.isPending || !newPassword || newPassword !== confirmPassword}
                                className={`w-full py-3.5 rounded-xl text-white font-semibold text-sm tracking-wide shadow-lg transition-all duration-300 ${!newPassword || newPassword !== confirmPassword
                                    ? "bg-gray-600 cursor-not-allowed shadow-none opacity-70"
                                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-600/40 hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.02]"
                                    }`}
                            >
                                {resetPasswordMutation.isPending ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Resetting...</span>
                                    </div>
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </form>
                    )}

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="text-gray-400 hover:text-white font-medium text-sm transition-colors"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyOTPAndResetPassword;
