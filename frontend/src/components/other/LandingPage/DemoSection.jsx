
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Monitor, Cpu, Fingerprint } from 'lucide-react';

export default function DemoSection() {
  const capabilities = [
    "Adaptive Linguistic Processing",
    "Real-time Acoustic Fingerprinting",
    "Semantic Logic Validation",
    "Executive Professional Feedback"
  ];

  return (
    <section id="demo" className="py-32 px-6 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

        {/* Left Side: Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 border border-gray-200 text-gray-500">
            <Monitor size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Technical Briefing</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-[1.1]">
            Experience the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-400">
              VIRQA Engine
            </span>
          </h2>

          <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-lg">
            Our platform goes beyond simple transcription. We analyze the technical depth and logical cohesion of every response in real-time.
          </p>

          <div className="space-y-4">
            {capabilities.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all">
                  <CheckCircle2 size={18} />
                </div>
                <span className="font-bold text-gray-700 text-sm tracking-tight">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Visualizer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="bg-gray-50 p-4 rounded-[3rem] border border-gray-100 shadow-[0_50px_100px_rgba(0,0,0,0.06)]">
            <div className="bg-gray-900 rounded-[2.5rem] p-10 relative overflow-hidden">

              {/* HUD Elements */}
              <div className="flex justify-between items-center mb-12 relative z-10">
                <div className="flex items-center gap-3">
                  <Cpu size={20} className="text-white/20" />
                  <div className="h-px w-20 bg-white/10" />
                </div>
                <Fingerprint size={20} className="text-emerald-500 opacity-50" />
              </div>

              {/* Analysis Content */}
              <div className="space-y-8 relative z-10">
                <div className="text-center">
                  <p className="text-5xl font-black text-white mb-2 tracking-tighter">89.4%</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Composite Integrity Score</p>
                </div>

                {/* Logic Chart Mockup */}
                <div className="flex gap-1 items-end h-24 justify-center">
                  {[0.4, 0.7, 0.9, 0.6, 0.8, 0.5, 0.9, 0.7, 0.4].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [`${h * 100}%`, `${h * 80}%`, `${h * 100}%`] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                      className="w-4 bg-white/20 rounded-full"
                    />
                  ))}
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Acoustic Logic Node</span>
                  </div>
                  <p className="text-white/80 text-sm font-medium italic">"Logical progression identified in technical explanation..."</p>
                </div>
              </div>

              {/* Grid Background */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

