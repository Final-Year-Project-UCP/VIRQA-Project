import React, { useState } from 'react';
import { Upload, X, FileText, Mic, Plus } from 'lucide-react';

// Toggle Switch Component
const ToggleSwitch = ({ checked, onChange }) => (
  <div className="relative">
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    <div className={`w-12 h-6 rounded-full transition ${checked ? 'bg-blue-600' : 'bg-gray-300'}`} />
    <div
      className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-6' : ''}`}
    />
  </div>
);

// Difficulty Slider Component
const DifficultySlider = ({ value, onChange }) => {
  const levels = [
    { id: 'easy', label: 'Easy', color: 'green' },
    { id: 'medium', label: 'Medium', color: 'blue' },
    { id: 'hard', label: 'Hard', color: 'orange' },
    { id: 'expert', label: 'Expert', color: 'red' },
  ];

  const currentIndex = levels.findIndex(l => l.id === value);
  const sliderValue = (currentIndex / (levels.length - 1)) * 100;

  return (
    <div className="space-y-4">
      {/* Slider Track */}
      <div className="relative h-2 bg-gray-200 rounded-full">
        <div className="absolute h-full bg-gradient-to-r from-green-500 via-blue-500 to-red-500 rounded-full w-full" />
        <div
          className="absolute top-1/2 w-6 h-6 bg-white border-2 border-blue-600 rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2"
          style={{ left: `${sliderValue}%` }}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={e => {
            const idx = Math.round((e.target.value / 100) * (levels.length - 1));
            onChange(levels[idx].id);
          }}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {/* Level Buttons */}
      <div className="flex justify-between mt-6">
        {levels.map((level, idx) => (
          <button
            key={level.id}
            type="button"
            onClick={() => onChange(level.id)}
            className={`flex flex-col items-center transition-all ${value === level.id ? 'scale-110' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                value === level.id
                  ? `bg-${level.color}-500 text-white ring-4 ring-${level.color}-300`
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {idx + 1}
            </div>
            <span className={`text-sm font-medium ${value === level.id ? 'text-gray-900' : 'text-gray-500'}`}>
              {level.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// File Upload Component
const FileUpload = ({ file, onUpload, onRemove }) => {
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    const validTypes = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain'];
    if (!validTypes.includes(f.type)) return alert('Upload valid file (PDF, DOC, DOCX, TXT)');
    if (f.size > 5 * 1024 * 1024) return alert('File size < 5MB');

    const reader = new FileReader();
    reader.onload = () => onUpload({ name: f.name, size: (f.size / 1024 / 1024).toFixed(2) + ' MB', type: f.type.split('/')[1].toUpperCase(), content: reader.result });
    reader.readAsText(f);
  };

  return (
    <div className="flex items-center gap-2">
      {file && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm">
            <div className="font-medium text-gray-800">{file.name}</div>
            <div className="text-xs text-gray-500">{file.size} • {file.type}</div>
          </div>
          <button onClick={onRemove} className="ml-2 p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <label className="group relative cursor-pointer">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          <Upload className="w-4 h-4 text-gray-600" /> <span className="text-sm text-gray-700 font-medium">Upload File</span>
        </div>
        <input type="file" className="hidden" onChange={handleFile} accept=".pdf,.doc,.docx,.txt" />
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
          PDF, DOC, DOCX, TXT (Max 5MB)
        </div>
      </label>
    </div>
  );
};

// Skill Input Component
const SkillInput = ({ skills, addSkill, removeSkill }) => {
  const [input, setInput] = useState('');
  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) {
      addSkill(trimmed);
      setInput('');
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {skills.map(s => (
          <span key={s} className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
            {s}
            <button onClick={() => removeSkill(s)} className="ml-2 text-blue-500 hover:text-blue-700 p-0.5 rounded-full hover:bg-blue-100">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a skill..."
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg"
        />
        <button onClick={handleAdd} className="lg:px-4 lg:py-2.5 px-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center lg:gap-2">
          <Plus className="w-4 h-4 lg:block hidden" /> Add
        </button>
      </div>
    </div>
  );
};

const CreateInterviewForm = () => {
  const [formData, setFormData] = useState({ title: '', jobDescription: '', difficulty: 'medium', transcriptionEnabled: true });
  const [skills, setSkills] = useState(['React','TypeScript','UI/UX Design']);
  const [uploadedFile, setUploadedFile] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create a New Interview</h1>
          <p className="text-gray-600 mt-2">Fill in the details below to configure your AI-powered interview.</p>
        </div>

        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); console.log({ ...formData, skills, uploadedFile }); alert('Interview saved'); }}>
          {/* Interview Details */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-3">Interview Details</h2>
            <input type="text" name="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Interview Title" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <FileUpload file={uploadedFile} onUpload={f => { setUploadedFile(f); setFormData({...formData, jobDescription: f.content}); }} onRemove={() => { setUploadedFile(null); setFormData({...formData, jobDescription: ''}); }} />
            <textarea value={formData.jobDescription} onChange={e => setFormData({...formData, jobDescription: e.target.value})} placeholder="Paste job description" rows="6" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <SkillInput skills={skills} addSkill={s => setSkills([...skills,s])} removeSkill={s => setSkills(skills.filter(sk => sk !== s))} />
          </div>

          {/* AI Configuration */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-3">AI Configuration</h2>
            <DifficultySlider value={formData.difficulty} onChange={v => setFormData({...formData, difficulty: v})} />
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Mic className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-800">Enable Real-time Transcription</span>
                  <p className="text-sm text-gray-500 mt-1">Instant transcription during the interview.</p>
                </div>
              </div>
              <ToggleSwitch checked={formData.transcriptionEnabled} onChange={e => setFormData({...formData, transcriptionEnabled: e.target.checked})} />
            </label>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button type="submit" className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg flex items-center gap-3 shadow-lg hover:shadow-xl">
               Create Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInterviewForm;
