import React from "react";

const FinalCTA = () => {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-slate-900 via-indigo-900 to-slate-800 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-linear-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
          Join the Future of Interviewing
        </h2>
        <p className="text-base sm:text-xl mb-6 sm:mb-10 text-gray-300">
          Try <span className="font-semibold text-white">VIRQA</span> now and transform how you prepare for interviews.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button className="bg-blue-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-blue-500/30">
            Start Demo
          </button>
          <button className="border-2 border-gray-300 text-gray-200 px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:border-white hover:text-white transition-all">
            Request Access
          </button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
