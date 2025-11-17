

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What is VIRQA?",
    a: "VIRQA is an AI-powered interview assistant that analyzes your speech, tone, and confidence to give real-time feedback and help you prepare for interviews effectively.",
  },
  {
    q: "How does the voice analysis work?",
    a: "Our system uses advanced speech processing and LLM-based evaluation to assess your fluency, tone, and clarity in real-time.",
  },
  {
    q: "Can I choose my interview domain?",
    a: "Yes! You can select from multiple domains like MERN Stack, Data Science, AI, or custom topics before starting your session.",
  },
  {
    q: "Is my voice data stored?",
    a: "No. VIRQA processes your voice locally during the session. We do not store or share any recordings or responses.",
  },
  {
    q: "Can I access feedback reports later?",
    a: "Yes, you can download your AI-generated interview feedback reports anytime after the session.",
  },
];

export default function FaqSection() {
  // removed the TypeScript generic so this works in plain JS/JSX
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section
      id="faqs"
      className="relative py-20 px-6 sm:px-8 bg-linear-to-b from-neutral-50 via-gray-100 to-zinc-100 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-gray-800 via-gray-900 to-zinc-800 bg-clip-text text-transparent animate-gradient-x">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Find quick answers to the most common questions about VIRQA
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-5 ">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;

            return (
              <motion.div
                key={i}
                className="group "
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              >
                <div className="bg-white/80 backdrop-blur-xl border  border-gray-200/70 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-400">
                  {/* Question Button */}
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex justify-between items-center text-left px-6 sm:px-8 py-5 sm:py-6 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-2xl"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                  >
                    <h3 className="text-base cursor-pointer sm:text-lg font-semibold text-gray-900 group-hover:text-gray-800 transition-colors pr-4">
                      {item.q}
                    </h3>

                    {/* Animated Chevron */}
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="shrink-0"
                    >
                      <ChevronDown
                        size={22}
                        className="text-gray-600 group-hover:text-gray-800 transition-colors cursor-pointer"
                      />
                    </motion.div>
                  </button>

                  {/* Answer Panel */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 sm:px-8 pb-5 sm:pb-6 pt-2 border-t border-gray-200/60">
                          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-600 mb-3">Still have questions?</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-gray-800 font-semibold hover:text-gray-900 transition-colors"
          >
            Contact Support
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </a>
        </motion.div>
      </div>

      {/* Subtle Ambient Glows (Neutral) */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-radial from-gray-300/20 via-transparent to-transparent blur-3xl -z-10 animate-float-slow"></div>
      <div className="absolute bottom-1/3 -right-28 w-80 h-80 bg-gradient-radial from-zinc-300/15 via-transparent to-transparent blur-3xl -z-10 animate-float-slow"></div>

      {/* Reusable Animations */}
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
          50% { transform: translateY(-12px); }
        }
        .animate-float-slow {
          animation: float-slow 14s ease-in-out infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }
      `}</style>
    </section>
  );
}
