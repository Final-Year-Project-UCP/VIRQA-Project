import { readDocx } from "../../utils/docReader";
import { readPDF } from "../../utils/pdfReader";
import { toast } from "react-toastify";
import { Upload, X, FileText} from 'lucide-react';

export const FileUpload = ({ file, onUpload, onRemove }) => {
  const handleFile = async (e) => {
    const f = e.target.files[0];
    console.log(f)
    if (!f) return;

    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];

    if (!validTypes.includes(f.type)) return toast.error('Upload valid file (PDF, DOC, DOCX, TXT)');
    if (f.size > 2 * 1024 * 1024) return toast.error('File size < 2MB');

    let content = '';
    try {
      if (f.type === 'application/pdf') {
        content = await readPDF(f);
      } else if (
        f.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        f.type === 'application/msword'
      ) {
        content = await readDocx(f);
      } else if (f.type === 'text/plain') {
        content = await f.text();
      }

      onUpload({
        name: f.name,
        size: (f.size / 1024 / 1024).toFixed(2) + ' MB',
        type: f.type.split('/')[1].toUpperCase(),
        content
      });
        e.target.value = "";

    } catch (err) {
      console.error(err);
      toast.error('Failed to read file');
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {file && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg max-w-full overflow-hidden">
          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm flex-1 min-w-0">
            <div className="font-medium text-gray-800 truncate" title={file.name}>{file.name}</div>
            <div className="text-xs text-gray-500 truncate" title={`${file.size} • ${file.type}`}>{file.size} • {file.type}</div>
          </div>
          <button
            onClick={onRemove}
            className="ml-2 p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <label className="group relative cursor-pointer">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          <Upload className="w-4 h-4 text-gray-600" /> 
          <span className="text-sm text-gray-700 font-medium">Upload File</span>
        </div>
        <input type="file" className="hidden" onChange={handleFile} accept=".pdf,.doc,.docx,.txt" />
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
          PDF, DOC, DOCX, TXT (Max 5MB)
        </div>
      </label>
    </div>
  );
};