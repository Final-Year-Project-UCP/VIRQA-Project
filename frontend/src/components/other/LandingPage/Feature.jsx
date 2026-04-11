
import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Languages, BarChart4, Target } from 'lucide-react';

const capabilities = [
  {
    icon: Target,
    title: "Semantic Relevance",
    desc: "Our AI evaluates the technical depth and conceptual accuracy of every response against industry standards.",
    detail: "Cross-referenced with verified technical documentation."
  },
  {
    icon: Languages,
    title: "Fluency & Pace",
    desc: "Analyzes spoken delivery, word choice, and sentence structure to ensure clear technical communication.",
    detail: "Measures words-per-minute and logical cohesion."
  },
  {
    icon: BrainCircuit,
    title: "Tone Analysis",
    desc: "Detects confidence levels and professional sentiment through advanced acoustic processing.",
    detail: "Identifies hesitation and stress markers in real-time."
  },
  {
    icon: BarChart4,
    title: "Overall Confidence",
    desc: "A composite score reflecting the candidate's mastery and readiness for high-stakes roles.",
    detail: "Compiled into comprehensive executive appraisal reports."
  }
];

export default function FeatureShowcase() {
  return (
    <section id="features" className="py-24 px-6 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6"
          >
            Technical Appraisal <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500">
              Powered by Logic
            </span>
          </motion.h2>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
            VIRQA evaluates every nuance of a candidate's performance across four core semantic and acoustic dimensions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {capabilities.map((cap, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900 mb-8 group-hover:bg-gray-900 group-hover:text-white transition-colors duration-500">
                <cap.icon size={28} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight">{cap.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed mb-6 text-sm">
                {cap.desc}
              </p>
              <div className="pt-6 border-t border-gray-50">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-tight">
                  {cap.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

