'use client';

import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-20 pb-24 px-6 sm:px-8 bg-linear-to-b from-neutral-50 via-gray-100 to-zinc-100 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        
        {/* Left Side — Text */}
        <div className="flex-1 text-center md:text-left space-y-8 order-1">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
            Speak. Evaluate. Improve{" "}
            <span className="bg-linear-to-r from-gray-700 via-gray-800 to-zinc-700 bg-clip-text text-transparent animate-gradient-x">
              AI-Powered Voice Interviews
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto md:mx-0">
            Experience adaptive, AI-driven interviews that analyze your tone, fluency, and confidence helping you refine your communication like never before.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
            <button className="group bg-linear-to-r from-gray-900 to-gray-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2">
              Try a Demo Interview
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>

            <button className="group border-2 border-gray-400 text-gray-800 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-800 hover:text-gray-900 hover:scale-105 transition-all flex items-center justify-center gap-2">
              <Play className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
              Watch How It Works
            </button>
          </div>
        </div>

        {/* Right Side — Image */}
        <div className="flex-1 flex justify-center order-2 md:order-2">
          <img
            src="https://cdn.prod.website-files.com/685be7dcd32275d383065239/685be7dcd32275d383068275_Blog%20Cover_2024_02_%20Interview%20Equipment%20Essentials%20for%20Recording%20In-Person%20_%20Online%20(1).webp"
            alt="AI Voice Interview"
            className="rounded-3xl shadow-2xl border border-gray-200 w-full max-w-[420px] md:max-w-full md:h-[520px] object-cover animate-fade-in"
          />
        </div>
      </div>

      {/* Subtle gradient glow background */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-radial from-gray-400/20 via-transparent to-transparent blur-3xl opacity-70 -z-10 animate-float-slow"></div>

      {/* Local Animations */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 6s ease infinite;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1.2s ease-out;
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
