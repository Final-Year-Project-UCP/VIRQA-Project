'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Upload, Download, Eye, Trash2, FileText, Loader2 } from 'lucide-react';
import { api } from '../../../../config/api.js';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../../../../utils/errorParser.js';

const DocumentsSection = ({ isEditing, tempProfile, onChange }) => {
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  // Sync documents list from parent (e.g. after profile loads or save completes)
  const [documents, setDocuments] = useState(tempProfile.documents || []);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setDocuments(tempProfile.documents || []);
  }, [tempProfile.documents]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await api.patch('/user/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      const updatedUser = response.data?.data;
      if (updatedUser?.resumeUrl) {
        toast.success('CV uploaded successfully!');
        
        // Update local documents
        const newDoc = {
          id: 'resume',
          name: updatedUser.resumeName || file.name,
          size: updatedUser.resumeSize || `${(file.size / 1024).toFixed(1)} KB`,
          url: updatedUser.resumeUrl,
        };
        const updated = [newDoc];
        setDocuments(updated);
        onChange('documents', updated);
        onChange('resumeUrl', updatedUser.resumeUrl);
        onChange('resumeFile', null); // cleared because it's already uploaded

        // Invalidate queries to refresh parent profile and TopNav/Sidebar
        queryClient.invalidateQueries(['candidateProfile']);
        queryClient.invalidateQueries(['profile']);
      } else {
        throw new Error('Upload succeeded but no resume URL was returned');
      }
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err, 'Failed to upload CV. Please try again.'));
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      e.target.value = '';
    }
  };

  const removeDocument = async (id) => {
    if (window.confirm("Are you sure you want to remove your resume?")) {
      try {
        await api.patch('/user/profile', { resumeUrl: '' });
        toast.success("Resume removed successfully!");
        
        setDocuments([]);
        onChange('documents', []);
        onChange('resumeFile', null);
        onChange('resumeUrl', '');
        
        queryClient.invalidateQueries(['candidateProfile']);
        queryClient.invalidateQueries(['profile']);
      } catch (err) {
        console.error(err);
        toast.error("Failed to remove resume.");
      }
    }
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
        <div className="mt-4">
          <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" disabled={isUploading} />
          {isUploading ? (
            <div className="w-full border-2 border-dashed border-blue-300 bg-blue-50/20 rounded-xl p-8 flex flex-col items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-blue-600 font-semibold animate-pulse">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span>Uploading CV... {uploadProgress}%</span>
              </div>
              <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
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
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentsSection;
