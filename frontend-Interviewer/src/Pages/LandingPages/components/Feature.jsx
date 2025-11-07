'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

export default function ProblemSolution() {
  const problemPoints = [
    "Static question banks",
    "No real-time voice analysis",
    "Unfair or inconsistent evaluations",
  ];

  const solutionPoints = [
    "Adaptive LLM-based questions",
    "Real-time speech-to-text + tone analysis",
    "Instant AI-generated feedback reports",
  ];

  return (
    <section id="features"
    
    className="relative py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-gray-50 via-neutral-100 to-zinc-100 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="grid lg:grid-cols-2 gap-8 sm:gap-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          {/* Problem Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-linear-to-br from-red-100/60 via-red-50 to-white rounded-3xl p-6 sm:p-8 border border-red-200 shadow-lg hover:shadow-2xl transition-all duration-500"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              The Problem with Traditional Interviews
            </h3>

            <ul className="space-y-4">
              {problemPoints.map((p, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 text-gray-700"
                >
                  <div className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center mt-0.5 text-sm text-red-800 font-semibold shadow-sm">
                    <X className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-base">{p}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Solution Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-linear-to-br from-emerald-100/60 via-teal-50 to-white rounded-3xl p-6 sm:p-8 border border-teal-200 shadow-lg hover:shadow-2xl transition-all duration-500"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              How VIRQA Solves It
            </h3>

            <ul className="space-y-4">
              {solutionPoints.map((s, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 text-gray-700"
                >
                  <div className="w-6 h-6 bg-teal-200 rounded-full flex items-center justify-center mt-0.5 text-sm text-teal-800 font-semibold shadow-sm">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-base">{s}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Accent Glow */}
      <motion.div
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-radial from-gray-300/20 via-transparent to-transparent blur-3xl opacity-60 -z-10"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
    </section>
  );
}
