import { ExternalLink, FileText, Video } from 'lucide-react';
import React from 'react';

const QuickLinks = () => {
  const links = [
    {
      icon: FileText,
      label: 'My Profile',
      description: 'Update your personal information',
      href: '/api/v1/candidates/profile'
    },
    {
      icon: Video,
      label: 'Join Interview',
      description: 'Enter scheduled meetings',
      href: '/api/v1/candidates/join'
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 md:p-6">
      <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
        Quick Links
      </h2>

      <div className="grid gap-3">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="
              flex items-center gap-3 p-4 
              border border-gray-100 rounded-lg 
              hover:border-blue-300 hover:bg-blue-50/40 
              transition-all duration-200 
              group hover:shadow-md hover:-translate-y-0.5
            "
          >
            {/* Icon */}
            <div
              className="
                p-2.5 bg-blue-100 rounded-lg 
                group-hover:bg-blue-200 
                transition-all duration-200
                group-hover:scale-110
              "
            >
              <link.icon size={18} className="text-blue-700" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 text-sm md:text-base group-hover:text-blue-700 transition-colors">
                {link.label}
              </h3>
              <p className="text-xs md:text-sm text-gray-500">
                {link.description}
              </p>
            </div>

            {/* Arrow */}
            <ExternalLink
              size={16}
              className="
                text-gray-400 transition-all group-hover:text-blue-600 
                group-hover:translate-x-1 duration-200
              "
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;
