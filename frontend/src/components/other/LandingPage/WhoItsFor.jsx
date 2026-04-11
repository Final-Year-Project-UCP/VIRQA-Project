
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, GraduationCap, ChevronRight } from 'lucide-react';

const audience = [
  {
    icon: Users,
    title: "Job Seekers",
    desc: "Enhance your communication, confidence, and technical depth for real-world interviews.",
    color: "gray"
  },
  {
    icon: Briefcase,
    title: "Employers",
    desc: "Automate voice-based candidate screening with precise AI-driven semantic and acoustic evaluations.",
    color: "zinc"
  },
  {
    icon: GraduationCap,
    title: "Institutions",
    desc: "Refine student speaking skills at scale with instant technical feedback and performance analytics.",
    color: "neutral"
  },
];

export default function StakeholderGrid() {
  return (
    <section id="platform" className="py-32 px-6 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6"
            >
              Tailored for the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500">
                Modern Ecosystem
              </span>
            </motion.h2>
            <p className="text-lg text-gray-500 font-medium">
              VIRQA bridges the gap between candidate preparation and enterprise evaluation through a unified voice-AI infrastructure.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {audience.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative p-10 bg-white border border-gray-100 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <div className="mb-10 w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-all duration-500">
                <a.icon size={24} />
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{a.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed mb-8">
                {a.desc}
              </p>

              <div className="flex items-center gap-2 text-gray-900 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                Explore Solution <ChevronRight size={14} />
              </div>

              {/* Decorative Corner Accent */}
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                 <a.icon size={120} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
