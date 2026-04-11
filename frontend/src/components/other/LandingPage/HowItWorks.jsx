
import React from 'react';
import { motion } from 'framer-motion';
import { Settings, ShieldCheck, Mic2, FileSearch } from 'lucide-react';

const steps = [
  {
    icon: Settings,
    title: "1. Configure Session",
    desc: "Define your domain, target role, and technical depth. Our AI builds a custom interviewer profile instantly.",
  },
  {
    icon: ShieldCheck,
    title: "2. Secure Lobby",
    desc: "Candidates undergo audio validation and hardware checks within a professional neutral lobby environment.",
  },
  {
    icon: Mic2,
    title: "3. Live AI Session",
    desc: "A fully voice-conducted interview where questions adapt in real-time to the candidate's logic and reasoning.",
  },
  {
    icon: FileSearch,
    title: "4. Executive Appraisal",
    desc: "Receive deep-dive analytical reports with semantic scoring, skill radar maps, and qualitative feedback.",
  }
];

export default function LifecycleSection() {
  return (
    <section id="how-it-works" className="py-32 px-6 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6"
          >
            The Interview <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">
              Lifecycle Lifecycle
            </span>
          </motion.h2>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
            From initial configuration to autonomous appraisal, VIRQA handles the entire recruitment funnel with precision.
          </p>
        </div>

        <div className="relative">
          {/* Connector Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-gray-100 -translate-y-1/2 -z-10" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center lg:items-start text-center lg:text-left"
              >
                <div className="w-16 h-16 rounded-2xl bg-gray-900 text-white flex items-center justify-center shadow-2xl shadow-gray-200 mb-8">
                  <step.icon size={28} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight">{step.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed text-sm">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
