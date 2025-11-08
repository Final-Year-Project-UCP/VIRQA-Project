
import { motion } from "framer-motion";

export default function DemoSection() {
  const features = [
    "Real-time voice analysis",
    "Adaptive questioning",
    "Instant feedback",
    "Confidence scoring",
  ];

  return (
    <section
      id="demo"
      className="relative py-20 px-6 sm:px-8 bg-linear-to-br from-neutral-50 via-gray-100 to-zinc-100 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
      
        <motion.div
          className="space-y-7"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
            See{" "}
            <span className="bg-linear-to-r from-gray-700 via-gray-900 to-zinc-800 bg-clip-text text-transparent">
              VIRQA
            </span>{" "}
            in Action
          </h2>
          <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
            Watch AI analyze your voice, tone, and confidence in real-time with instant,
            actionable insights.
          </p>

          <ul className="space-y-4 pt-2">
            {features.map((item, i) => (
              <motion.li
                key={i}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <div className="w-7 h-7 bg-linear-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center shadow-md ring-2 ring-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-1 shadow-2xl border border-gray-200/50 hover:shadow-gray-400/40 transition-all duration-500">
            <div className="bg-linear-to-br from-zinc-900 via-gray-800 to-gray-900 rounded-3xl p-6 md:p-8 relative overflow-hidden">
            
              <div className="absolute inset-0 rounded-3xl bg-linear-to-tr from-indigo-600/20 via-cyan-400/10 to-pink-500/20 blur-3xl"></div>

             
              <div className="flex items-center gap-2 mb-6 relative z-10">
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                <div className="ml-3 flex-1 h-px bg-linear-to-r from-gray-500 to-transparent opacity-30"></div>
              </div>

           
              <div className="space-y-6 relative z-10 text-sm font-mono">
                 <div className="text-center pb-4 border-b border-gray-700">
                  <motion.p
                    className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  >
                    87% Confidence
                  </motion.p>
                  <p className="text-xs text-gray-400 mt-1">
                    Tone: Clear | Fluency: High | Pace: Optimal
                  </p>
                </div>

              
                <div className="space-y-5">
                  <div className="bg-linear-to-r from-gray-800 to-gray-700 rounded-xl p-4 text-gray-300 border border-gray-600">
                    <p className="text-xs text-gray-400 mb-1">Question:</p>
                    <p>Tell me about your experience with AI-driven systems...</p>
                  </div>

                  <motion.div
                    className="bg-linear-to-r from-cyan-600 via-indigo-500 to-pink-500 rounded-xl p-4 text-white shadow-lg border border-gray-700"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <p className="text-xs">Analyzing speech patterns, tone, and clarity...</p>
                  </motion.div>

              
                  <div className="flex gap-1 items-end h-16 justify-center">
                    {[0.6, 1.2, 1.8, 1.4, 2.1, 1.6, 1.0, 0.8].map((h, i) => (
                      <motion.div
                        key={i}
                        className="w-2 rounded-full bg-linear-to-t from-pink-500 via-cyan-400 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                        style={{ height: `${h * 20}px` }}
                        animate={{
                          height: [`${h * 15}px`, `${h * 35}px`, `${h * 15}px`],
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: i * 0.08,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-gradient-radial from-cyan-400/20 via-transparent to-transparent blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-10 -left-20 w-80 h-80 bg-gradient-radial from-pink-400/15 via-transparent to-transparent blur-3xl -z-10 animate-pulse"></div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .animate-pulse { animation: pulse 8s ease-in-out infinite; }
        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }
      `}</style>
    </section>
  );
}
