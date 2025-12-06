'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GraduationCap, Calendar, MapPin, AlertCircle } from 'lucide-react';

const EducationSection = ({ isEditing, tempProfile, onChange }) => {
  const [educations, setEducations] = useState(
    tempProfile.educations.length > 0
      ? tempProfile.educations
      : [{ id: Date.now(), degree: '', institution: '', location: '', year: '', description: '' }]
  );

  // Sync local state with tempProfile
  useEffect(() => {
    onChange('educations', educations);
  }, [educations]);

  const addEducation = () => {
    const newEdu = { id: Date.now(), degree: '', institution: '', location: '', year: '', description: '' };
    setEducations(prev => [...prev, newEdu]);
  };

  const removeEducation = (id) => {
    if (educations.length > 1) {
      setEducations(prev => prev.filter(e => e.id !== id));
    }
  };

  const updateEducation = (id, field, value) => {
    setEducations(prev =>
      prev.map(e => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <GraduationCap size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Education</h3>
            <p className="text-sm text-gray-500 mt-1">Your academic background</p>
          </div>
        </div>
        {isEditing && (
          <button
            onClick={addEducation}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus size={18} />
            Add Education
          </button>
        )}
      </div>

      <div className="space-y-4">
        {educations.map((edu, idx) => (
          <div key={edu.id} className="border p-4 rounded-lg bg-gray-50 sm:flex sm:flex-col sm:gap-4">
            {isEditing ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={edu.location}
                    onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    placeholder="Year"
                    value={edu.year}
                    onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Description (optional)"
                  value={edu.description}
                  onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                  className="border p-2 rounded w-full mt-2"
                />
                {educations.length > 1 && (
                  <button
                    onClick={() => removeEducation(edu.id)}
                    className="mt-2 text-red-600 flex items-center gap-1 hover:underline"
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                )}
              </>
            ) : (
              <div className="space-y-1">
                <h4 className="font-semibold">{edu.degree || 'Degree not specified'}</h4>
                <p>{edu.institution || 'Institution not specified'}</p>
                <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
                  {edu.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {edu.location}
                    </span>
                  )}
                  {edu.year && (
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {edu.year}
                    </span>
                  )}
                </div>
                {edu.description && <p className="text-gray-700 text-sm">{edu.description}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationSection;
