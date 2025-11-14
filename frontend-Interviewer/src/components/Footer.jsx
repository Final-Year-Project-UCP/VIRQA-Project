import React from "react";
import { Mic, Mail, Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8 text-center md:text-left">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-linear-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-linear-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                VIRQA
              </span>
            </div>
            <p className="text-xs sm:text-sm">AI-Powered Voice Interviews</p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-white mb-2 sm:mb-3 text-sm sm:text-base">
              Quick Links
            </h4>
            <ul className="space-y-1 text-xs sm:text-sm">
              {["Home", "About", "Contact", "Terms"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-white mb-2 sm:mb-3 text-sm sm:text-base">
              Contact
            </h4>
            <div className="flex items-center gap-2 text-xs sm:text-sm mb-1">
              <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
              contact@virqa.ai
            </div>
          </div>

          {/* Follow */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-white mb-2 sm:mb-3 text-sm sm:text-base">
              Follow
            </h4>
            <div className="flex gap-2 sm:gap-3">
              <a
                href="#"
                className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Github className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="#"
                className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-4 sm:pt-6 text-center text-xs sm:text-sm">
          <p>© 2025 Virqa | University of Central Punjab</p>
          <p className="mt-1">A final-year project by BSSE students</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
