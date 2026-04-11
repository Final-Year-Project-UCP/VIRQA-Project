import React from "react";
import { Mic, Mail, Github, Linkedin } from "lucide-react";

const Footer = ({ openTerms }) => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth"
      });
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-400 py-16 sm:py-24 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                VIRQA
              </span>
            </div>
            <p className="text-sm leading-relaxed text-center md:text-left">
              Revolutionizing professional appraisal through advanced AI-driven voice interviews.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-white mb-6 uppercase tracking-widest text-xs">
              Quick Links
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Home</button>
              </li>
              <li>
                <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button>
              </li>
              <li>
                <button onClick={() => scrollToSection('demo')} className="hover:text-white transition-colors">Demo</button>
              </li>
              <li>
                <button onClick={openTerms} className="hover:text-white transition-colors font-bold text-gray-200 underline decoration-gray-700 underline-offset-4">Terms & Conditions</button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-white mb-6 uppercase tracking-widest text-xs">
              Contact
            </h4>
            <div className="flex items-center gap-3 text-sm mb-4">
              <Mail className="w-4 h-4 text-blue-400" />
              contact@virqa.ai
            </div>
          </div>

          {/* Follow */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-white mb-6 uppercase tracking-widest text-xs">
              Follow
            </h4>
            <div className="flex gap-4">
              <a href="#" className="p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors text-white">
                <Github size={20} />
              </a>
              <a href="#" className="p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors text-white">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-xs">
          <p>© 2025 Virqa | University of Central Punjab</p>
          <p className="mt-2 text-gray-500">A final-year project by BSSE students</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
