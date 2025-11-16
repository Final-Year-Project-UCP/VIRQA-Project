import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { IoIosArrowRoundBack } from "react-icons/io"; 

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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">

      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

        <div className="text-center mb-6">
          <h2 className='text-3xl font-extrabold text-gray-900'>Forgot Your Password?</h2>
          <p className="mt-2 text-gray-500">
            Enter your email address to receive a verification code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email Field with Small Error Message Below */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
              className={`w-full px-4 py-3 border rounded-lg shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200
              ${errorMessage ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="you@gmail.com"
              disabled={isLoading}
            />
            {/* Small Error Message Below Input */}
            {errorMessage && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <span className="mr-2"></span>
                {errorMessage}
              </p>
            )}
          </div>

          {/* SUCCESS MESSAGE (Keep as is since it's positive feedback) */}
       

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading || successMessage}
            className={`w-full py-3 px-4 rounded-lg font-medium transition duration-200 ${
              isLoading || successMessage
                ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                Sending Code...
              </div>
            ) : (
              'Send Reset Code'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        {/* Google Button */}
        <button
          disabled
          className="cursor-pointer w-full flex items-center justify-center px-4 p-3 border border-gray-300 rounded-lg 
          shadow-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-200 mb-4"
        >
          <span className="mr-2"><FcGoogle className='text-xl'/></span>
          Sign in with Google
        </button>

        {/* Back to Login */}
        <Link 
          to="/login" 
          className="text-sm flex items-center justify-center text-gray-400 hover:text-gray-500 font-medium transition duration-200"
        >
          <IoIosArrowRoundBack className='text-2xl' />
          Back to Login
        </Link>
        
      </div>
    </div>
  );
};

export default ForgotPasswordStageOne;