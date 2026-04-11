
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-32 px-6 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.15)]"
        >
          {/* Background Elements */}
          <div className="absolute top-0 right-0 p-20 opacity-10">
             <Sparkles size={200} className="text-white" />
          </div>
          <div className="absolute bottom-0 left-0 p-20 opacity-5">
             <div className="w-80 h-80 bg-white rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-7xl font-black text-white tracking-tight leading-[1.05]">
              Join the Future of <br />
              <span className="text-gray-400">Autonomous Appraisal</span>
            </h2>
            
            <p className="text-xl text-gray-400 font-medium">
              Start your technical practicing session or integrate VIRQA into your enterprise recruitment funnel today.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
              <button 
                onClick={() => navigate('/login')}
                className="px-12 py-6 bg-white text-gray-900 rounded-[2.5rem] font-black text-xl hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-3"
              >
                Join Now
                <ArrowRight size={22} />
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="px-12 py-6 border-2 border-white/20 text-white rounded-[2.5rem] font-black text-xl hover:border-white transition-all shadow-xl"
              >
                Request Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
