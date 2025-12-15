import { useState } from 'react';
import { Upload, X, FileSpreadsheet, Mail } from 'lucide-react';
import { toast } from 'react-toastify';

const JobDetailsStep = ({ formData, setFormData, onNext }) => {
    const [excelFile, setExcelFile] = useState(null);
    const [candidateEmails, setCandidateEmails] = useState([]);

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '.xlsx',
            '.xls'
        ];

        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!['xlsx', 'xls'].includes(fileExtension)) {
            toast.error('Please upload a valid Excel file (.xlsx or .xls)');
            return;
        }

        setExcelFile(file);

        // Dummy email extraction - In real implementation, you'd parse the Excel file
        const dummyEmails = [
            'john.doe@example.com',
            'jane.smith@example.com',
            'michael.johnson@example.com',
            'sarah.williams@example.com',
            'david.brown@example.com',
            'emily.davis@example.com',
            'robert.miller@example.com',
            'lisa.wilson@example.com'
        ];

        setCandidateEmails(dummyEmails);
        toast.success(`Extracted ${dummyEmails.length} candidate emails from ${file.name}`);
    };

    const removeFile = () => {
        setExcelFile(null);
        setCandidateEmails([]);
    };

    const handleNext = () => {
        if (!formData.jobTitle.trim()) {
            toast.error('Please enter a job title');
            return;
        }
        if (!formData.jobDescription.trim()) {
            toast.error('Please enter a job description');
            return;
        }
        if (!excelFile) {
            toast.error('Please upload an Excel file with candidate emails');
            return;
        }

        setFormData({ ...formData, candidateEmails });
        onNext();
    };

    return (
        <div className="space-y-6">
            {/* Job Title */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Job Title</h2>
                <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    placeholder="e.g., Senior Frontend Developer"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Job Description</h2>
                <textarea
                    value={formData.jobDescription}
                    onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                    placeholder="Paste or write the job description here..."
                    rows="8"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
                <div className="mt-2 text-sm text-gray-500 text-right">
                    {formData.jobDescription.length} characters
                </div>
            </div>

            {/* Excel Upload */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Candidate Emails</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Upload an Excel file (.xlsx or .xls) containing candidate email addresses
                </p>

                {!excelFile ? (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-12 h-12 text-gray-400 mb-3" />
                            <p className="mb-2 text-sm text-gray-600">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">Excel files only (.xlsx, .xls)</p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept=".xlsx,.xls"
                            onChange={handleFileUpload}
                        />
                    </label>
                ) : (
                    <div className="space-y-4">
                        {/* Uploaded File Info */}
                        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-3">
                                <FileSpreadsheet className="w-8 h-8 text-green-600" />
                                <div>
                                    <p className="font-medium text-gray-900">{excelFile.name}</p>
                                    <p className="text-sm text-gray-600">
                                        {(excelFile.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={removeFile}
                                className="p-2 hover:bg-green-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Extracted Emails */}
                        {candidateEmails.length > 0 && (
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                    <h3 className="font-semibold text-gray-900">
                                        Extracted {candidateEmails.length} Candidate Emails
                                    </h3>
                                </div>
                                <div className="max-h-48 overflow-y-auto space-y-1">
                                    {candidateEmails.map((email, index) => (
                                        <div
                                            key={index}
                                            className="px-3 py-2 bg-white rounded text-sm text-gray-700 border border-blue-100"
                                        >
                                            {email}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex justify-end">
                <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                >
                    Generate AI Prompt →
                </button>
            </div>
        </div>
    );
};

export default JobDetailsStep;
