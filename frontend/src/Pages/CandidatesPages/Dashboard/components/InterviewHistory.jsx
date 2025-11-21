import React from 'react';
import { ExternalLink } from 'lucide-react';

const InterviewHistory = () => {
  const history = [
    {
      id: 1,
      role: 'UI/UX Designer',
      institute: 'Greenwood University',
      date: 'June 16, 2024',
      interviewer: 'John Applesseed',
      status: 'Selected',
      statusColor: 'bg-green-100 text-green-700 border border-green-200'
    },
    {
      id: 2,
      role: 'Frontend Developer',
      institute: 'State College',
      date: 'May 20, 2024',
      interviewer: 'Sarah Lee',
      status: 'Selected',
      statusColor: 'bg-green-100 text-green-700 border border-green-200'
    },
    {
      id: 3,
      role: 'Product Manager',
      institute: 'Tech Institute',
      date: 'April 10, 2024',
      interviewer: 'Michael Chen',
      status: 'Rejected',
      statusColor: 'bg-red-100 text-red-700 border border-red-200'
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 md:p-6">
      <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
        Interview History
      </h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/60">
              {['Role', 'Institute', 'Date', 'Interviewer', 'Status'].map((header) => (
                <th
                  key={header}
                  className="text-left py-3 px-4 text-xs font-semibold text-gray-600 tracking-wide"
                >
                  {header.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {history.map((item) => (
              <tr
                key={item.id}
                className="
                  border-b border-gray-100 
                  hover:bg-blue-50/40 
                  transition-all duration-200 
                  hover:-translate-y-px 
                "
              >
                <td className="py-3 px-4 font-medium text-gray-900">{item.role}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{item.institute}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{item.date}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{item.interviewer}</td>

                <td className="py-3 px-4">
                  <span
                    className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full 
                      text-xs font-medium shadow-sm ${item.statusColor}
                    `}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="
              p-4 border border-gray-200 rounded-lg 
              hover:border-blue-300 hover:bg-blue-50/40 
              transition-all duration-200 hover:shadow-sm hover:-translate-y-px
            "
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900 text-sm">{item.role}</h3>
              <span
                className={`
                  inline-flex items-center px-2.5 py-0.5 
                  rounded-full text-xs font-medium shadow-sm ${item.statusColor}
                `}
              >
                {item.status}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Institute:</span>
                <span className="text-gray-900">{item.institute}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span className="text-gray-900">{item.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Interviewer:</span>
                <span className="text-gray-900">{item.interviewer}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewHistory;
