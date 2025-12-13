import { NavLink } from "react-router-dom";
import { Sparkles, Zap } from "lucide-react";

const ComingSoon = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 px-6 text-center relative overflow-hidden">

      {/* Soft Background Glow */}
      <div className="absolute w-80 h-80 bg-purple-300/40 blur-3xl rounded-full -top-16 -left-20 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-blue-300/40 blur-3xl rounded-full -bottom-20 -right-20 animate-pulse-slow"></div>

      {/* GIF Section */}
      <div className="relative z-10 w-full max-w-sm animate-float">
        <img
          src="https://cdn.dribbble.com/userupload/20864908/file/original-c4aeb1d5d36fefd5831a4dab43458303.gif"
          alt="Coming Soon Animation"
          className="w-full rounded-xl shadow-xl"
        />
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-8 flex items-center justify-center gap-2">
        Feature Coming Soon
        <Sparkles className="text-yellow-500 animate-pulse" />
      </h1>

      {/* Subtitle */}
      <p className="text-gray-600 mt-3 text-base md:text-lg max-w-lg">
        We’re working on something awesome!  
        This feature will be available very soon.
      </p>

      {/* Button */}
      <NavLink
        to="/api/v1/candidates/home"
        className="mt-7 inline-block px-7 py-3 bg-black text-white rounded-lg text-sm font-medium shadow-md hover:opacity-90 active:scale-95 transition-transform flex items-center gap-2"
      >
        <Zap size={16} /> Go Back Home
      </NavLink>

      {/* Custom Animations */}
      <style>{`
        .animate-float {
          animation: floatUpDown 3s ease-in-out infinite;
        }
        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-pulse-slow {
          animation: pulseSlow 4s infinite;
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ComingSoon;
