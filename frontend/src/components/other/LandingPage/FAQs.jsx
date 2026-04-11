

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "How does the AI evaluate my technical accuracy?",
    answer: "Our engine uses large language models (LLMs) to perform semantic analysis on your transcripts. It cross-references your answers with specific domain knowledge to measure 'Semantic Relevance' and technical depth."
  },
  {
    question: "Is my voice recording stored on the servers?",
    answer: "To provide detailed analytical reports and employer dashboards, we securely store the transcripts and metric analysis of your session. Raw audio is handled with strict encryption and is only accessible for legitimate appraisal purposes."
  },
  {
    question: "Can I customize the interview for specific job roles?",
    answer: "Yes, VIRQA allows employers to configure domain-specific interviews. You can define the technical stack, seniority level, and even specific behavioral competency frameworks for the AI to follow."
  },
  {
    question: "What metrics are included in the final report?",
    answer: "Every report includes a quantitative breakdown of Semantic Relevance, Fluency, Tone, and Confidence, alongside a qualitative executive summary and a full transcript of the session."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faqs" className="py-32 px-6 bg-gray-50 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-400 mb-6">
            <HelpCircle size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Knowledge Base</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Common Inquiries
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-8 py-7 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
              >
                <span className="text-lg font-bold text-gray-900">{faq.question}</span>
                <div className={`p-2 rounded-full transition-all duration-300 ${openIndex === i ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {openIndex === i ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>

              <AnimatePresence mode="wait">
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-8 pb-8 text-gray-500 font-medium leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


