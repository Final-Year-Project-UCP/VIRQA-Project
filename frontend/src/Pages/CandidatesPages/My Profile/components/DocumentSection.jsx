'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Upload, Download, Eye, Trash2, FileText } from 'lucide-react';

const DocumentsSection = ({ isEditing, tempProfile, onChange }) => {
  const fileInputRef = useRef(null);

  // Use tempProfile.documents as initial state
  const [documents, setDocuments] = useState(tempProfile.documents || []);

  // Whenever documents change, update the parent
  useEffect(() => {
    onChange('documents', documents);
  }, [documents]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const newDoc = {
      id: Date.now(),
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      url: URL.createObjectURL(file),
      file,
    };

    setDocuments((prev) => [...prev, newDoc]);

    // Clear input value so same file can be uploaded again if needed
    e.target.value = '';
  };

  const removeDocument = (id) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const getFileIcon = (name) => {
    const ext = name.split('.').pop()?.toLowerCase();
    const icons = { pdf: '📄', doc: '📝', docx: '📝', txt: '📃', jpg: '🖼️', jpeg: '🖼️', png: '🖼️' };
    return icons[ext] || '📎';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold">Documents</h3>
      </div>

      {documents.length === 0 ? (
        <p className="text-center text-gray-400 py-8">No documents uploaded yet</p>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center border p-3 rounded-lg gap-3 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="text-2xl">{getFileIcon(doc.name)}</div>
                <div className="truncate">
                  <p className="font-medium text-gray-900 truncate max-w-xs">{doc.name}</p>
                  <p className="text-sm text-gray-500">{doc.size}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <a
                  href={doc.url}
                  download={doc.name}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                >
                  <Download size={18} />
                </a>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                >
                  <Eye size={18} />
                </a>
                {isEditing && (
                  <button
                    onClick={() => removeDocument(doc.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <>
          <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition"
          >
            <Upload size={32} />
            <div className="text-center">
              <p className="font-medium">Upload Document</p>
              <p className="text-sm">PDF, Word, or Image • Max 5MB</p>
            </div>
          </button>
        </>
      )}
    </div>
  );
};

export default DocumentsSection;
