'use client';

import React from 'react';
import { Calendar, Clock, CheckCircle, Clock4, XCircle } from 'lucide-react';

const ResultsHeader = ({ interview }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'evaluated':
        return <CheckCircle size={20} className="text-blue-600" />;
      case 'pending':
        return <Clock4 size={20} className="text-orange-600" />;
      default:
        return <XCircle size={20} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'evaluated':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            {interview.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-400" />
              <span>{interview.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-gray-400" />
              <span>{interview.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(interview.status)}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Interviewer</p>
            <p className="font-semibold text-gray-900">{interview.interviewer}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {interview.interviewer.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsHeader;