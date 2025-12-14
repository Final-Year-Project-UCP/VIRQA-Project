import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { IoIosArrowRoundBack } from "react-icons/io";
import { motion } from 'framer-motion';
import Logo from '../../components/common/Logo.jsx';

const ForgotPasswordStageOne = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendResetCode = async (email) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      // TODO: TanStack mutation will replace this section later
      setTimeout(() => {
        setSuccessMessage('Verification code sent! Check your inbox.');
        setIsLoading(false);

        navigate('/reset-password/verify-otp', { state: { email } });
      }, 1500);

    } catch (err) {
      setErrorMessage(err.message || 'Failed to send reset code. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid Gmail address');
      return;
    }

    handleSendResetCode(email);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 flex flex-col justify-center items-center relative overflow-hidden font-sans">

      {/* Animated Grid on Hover (from ContactUs) */}
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
        {/* Logo Section */}
        <div className="mb-8 flex justify-center">
          <Logo theme="light" className="scale-125" />
        </div>

        {/* Dark Glass Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8">

          <div className="text-center mb-8">
            <h2 className='text-3xl font-bold text-white mb-2'>Forgot Password?</h2>
            <p className="text-gray-400">
              Enter your email address to receive a verification code.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage('');
                }}
                required
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl shadow-sm outline-none transition-all duration-200 text-white placeholder-gray-500
                ${errorMessage
                    ? 'border-red-500/50 focus:ring-2 focus:ring-red-500/30'
                    : 'border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30'}`}
                placeholder="you@gmail.com"
                disabled={isLoading}
              />
              {/* Error Message */}
              {errorMessage && (
                <p className="mt-2 text-sm text-red-400 flex items-center animate-in fade-in slide-in-from-top-1">
                  {errorMessage}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || successMessage}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${isLoading || successMessage
                ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                : 'bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-500/30 hover:scale-[1.02]'
                }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                'Send Reset Code'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-gray-500 backdrop-blur-sm rounded-full">OR</span>
            </div>
          </div>

          {/* Google Button */}
          <button
            disabled
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-white/10 rounded-xl 
            shadow-sm font-semibold text-gray-300 bg-white/5 hover:bg-white/10 transition-all duration-200 mb-6 cursor-not-allowed opacity-50"
          >
            <FcGoogle className='text-xl' />
            <span>Sign in with Google</span>
          </button>

          {/* Back to Login */}
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-gray-400 hover:text-white font-medium transition-colors group"
          >
            <IoIosArrowRoundBack className='text-2xl transition-transform group-hover:-translate-x-1' />
            Back to Login
          </Link>

        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordStageOne;
