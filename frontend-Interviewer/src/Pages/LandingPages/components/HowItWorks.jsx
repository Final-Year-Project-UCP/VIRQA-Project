"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Mic, LineChart } from "lucide-react";

const steps = [
  {
    icon: CheckCircle2,
    title: "Start Interview",
    desc: "Choose your domain and let VIRQA generate smart, adaptive questions powered by LLMs.",
  },
  {
    icon: Mic,
    title: "Speak & Analyze",
    desc: "Answer naturally while VIRQA evaluates your tone, confidence, and clarity in real-time.",
  },
  {
    icon: LineChart,
    title: "Get Instant Feedback",
    desc: "Receive AI-generated reports with insights and improvement recommendations.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative py-24 px-6 sm:px-8 bg-linear-to-b from-neutral-50 via-gray-100 to-zinc-100 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-5xl font-bold bg-linear-to-r from-gray-800 via-gray-900 to-zinc-800 bg-clip-text text-transparent animate-gradient-x">
            How It Works
          </h2>
          <p className="mt-4 text-gray-600 text-base sm:text-lg">
            Experience intelligent interviews in just 3 seamless steps
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-16 md:gap-8">
          {/* Connector line (visible and elegant) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-linear-to-r from-gray-300 via-gray-400 to-gray-500 opacity-60 -z-10"></div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                className="relative flex flex-col items-center text-center md:text-left bg-white border border-gray-200 rounded-2xl shadow-md p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                {/* Step Number or Icon */}
                <motion.div
                  className="w-16 h-16 flex items-center justify-center rounded-full bg-linear-to-br from-gray-800 to-gray-700 text-white shadow-lg mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Icon className="w-7 h-7" />
                </motion.div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {step.desc}
                </p>

                {/* Step indicator for mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden w-px h-16 bg-linear-to-b from-gray-300 to-gray-500 mt-8"></div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Floating glow background */}
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-radial from-gray-400/20 via-transparent to-transparent blur-3xl opacity-70 -z-10 animate-float-slow"></div>

      {/* Local animations */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 6s ease infinite;
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
