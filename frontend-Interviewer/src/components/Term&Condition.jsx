"use client";

import { motion } from "framer-motion";

export default function TermsSection() {
  return (
    <section
      id="terms"
      className="relative py-20 px-6 sm:px-8 bg-gradient-to-b from-black via-zinc-950 to-gray-900 text-gray-300 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-100 via-gray-300 to-gray-500 bg-clip-text text-transparent animate-gradient-x">
            Terms & Conditions
          </h2>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Please read these terms carefully before using VIRQA.
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          className="space-y-7 text-gray-400 leading-relaxed text-justify"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p>
            <span className="text-gray-100 font-semibold">1. Introduction:</span>{" "}
            Welcome to <span className="text-gray-200 font-medium">VIRQA</span>, an AI-powered
            interview preparation platform that helps users enhance their communication and
            confidence through intelligent feedback. By accessing or using our services, you agree to
            comply with and be bound by these Terms & Conditions.
          </p>

          <p>
            <span className="text-gray-100 font-semibold">2. Use of the Platform:</span>{" "}
            VIRQA is intended for educational and professional preparation purposes only. You agree
            not to use the service for any illegal, harmful, or misleading activities. You are
            responsible for maintaining the confidentiality of your account information.
          </p>

          <p>
            <span className="text-gray-100 font-semibold">3. Data Privacy:</span>{" "}
            Your privacy is important to us. VIRQA processes your voice and responses in real-time
            without storing, selling, or sharing your data. All interactions are securely handled to
            ensure confidentiality and safety.
          </p>

          <p>
            <span className="text-gray-100 font-semibold">4. AI Accuracy Disclaimer:</span>{" "}
            While VIRQA uses advanced AI technologies to provide feedback and analysis, we do not
            guarantee the absolute accuracy of the system’s interpretations or recommendations.
            Users are encouraged to use AI feedback as a supportive guide rather than a definitive
            evaluation.
          </p>

          <p>
            <span className="text-gray-100 font-semibold">5. Modifications:</span>{" "}
            VIRQA reserves the right to update, modify, or discontinue any part of the platform or
            these Terms & Conditions at any time without prior notice. Continued use of the platform
            implies acceptance of any changes made.
          </p>

          <p>
            <span className="text-gray-100 font-semibold">6. Limitation of Liability:</span>{" "}
            VIRQA shall not be held responsible for any damages, losses, or issues arising from the
            use or inability to use the platform, including inaccuracies in AI feedback.
          </p>

          <p>
            <span className="text-gray-100 font-semibold">7. Governing Law:</span>{" "}
            These Terms & Conditions are governed by and construed in accordance with applicable
            laws. Any disputes arising under these terms will be subject to the jurisdiction of the
            respective courts.
          </p>

          <p className="text-gray-500 italic mt-10 text-sm">
            By using VIRQA, you acknowledge that you have read, understood, and agreed to these
            Terms & Conditions.
          </p>
        </motion.div>
      </div>

      {/* Ambient lighting */}
      <div className="absolute top-1/4 -left-24 w-96 h-96 bg-gradient-radial from-gray-600/20 via-transparent to-transparent blur-3xl -z-10 animate-fade"></div>
      <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-gradient-radial from-gray-500/15 via-transparent to-transparent blur-3xl -z-10 animate-fade"></div>

      {/* Animations */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 6s ease infinite;
        }

        @keyframes fade {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        .animate-fade {
          animation: fade 10s ease-in-out infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }
      `}</style>
    </section>
  );
}
