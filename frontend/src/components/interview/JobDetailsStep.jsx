import { useState } from 'react';
import { Upload, X, FileSpreadsheet, Mail, Loader2, Plus, UserPlus } from 'lucide-react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

const JobDetailsStep = ({ formData, setFormData, onNext }) => {
    const [excelFile, setExcelFile] = useState(null);
    const [candidateEmails, setCandidateEmails] = useState(formData.candidateEmails || []);
    const [isParsing, setIsParsing] = useState(false);
    const [manualEmail, setManualEmail] = useState('');

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!['xlsx', 'xls'].includes(fileExtension)) {
            toast.error('Please upload a valid Excel file (.xlsx or .xls)');
            return;
        }

        setExcelFile(file);
        setIsParsing(true);

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                const extractedEmails = new Set(candidateEmails);
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                jsonData.forEach(row => {
                    row.forEach(cell => {
                        if (typeof cell === 'string') {
                            const trimmedCell = cell.trim();
                            if (emailRegex.test(trimmedCell)) {
                                extractedEmails.add(trimmedCell);
                            }
                        }
                    });
                });

                const emailList = Array.from(extractedEmails);
                if (emailList.length === candidateEmails.length) {
                    toast.warn('No new valid email addresses found in the Excel file');
                } else {
                    setCandidateEmails(emailList);
                    toast.success(`Total ${emailList.length} candidate emails ready`);
                }
            } catch (error) {
                toast.error('Failed to parse the Excel file');
            } finally {
                setIsParsing(false);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleAddManualEmail = (e) => {
        e.preventDefault();
        const email = manualEmail.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) return;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }
        if (candidateEmails.includes(email)) {
            toast.warn('Email already added');
            return;
        }

        setCandidateEmails([...candidateEmails, email]);
        setManualEmail('');
        toast.success('Candidate added manually');
    };

    const removeEmail = (emailToRemove) => {
        setCandidateEmails(candidateEmails.filter(email => email !== emailToRemove));
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
        if (candidateEmails.length === 0) {
            toast.error('Please add at least one candidate (Excel or Manual)');
            return;
        }

        setFormData({ ...formData, candidateEmails });
        onNext();
    };

    return (
        <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Job Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            Job Title
                        </h2>
                        <input
                            type="text"
                            value={formData.jobTitle}
                            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                            placeholder="e.g., Senior Frontend Developer"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Job Description</h2>
                        <textarea
                            value={formData.jobDescription}
                            onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                            placeholder="Paste or write the job description here..."
                            rows="10"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm"
                        />
                    </div>
                </div>

                {/* Right: Candidates */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Candidates</h2>
                        
                        {/* Manual Entry */}
                        <form onSubmit={handleAddManualEmail} className="flex gap-2 mb-6">
                            <div className="relative flex-1">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={manualEmail}
                                    onChange={(e) => setManualEmail(e.target.value)}
                                    placeholder="Enter candidate email"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-6 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" /> Add
                            </button>
                        </form>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">OR UPLOAD EXCEL</span>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>

                        {/* Excel Entry */}
                        <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${isParsing ? 'bg-blue-50 border-blue-500' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}>
                            {isParsing ? (
                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                            ) : (
                                <>
                                    <FileSpreadsheet className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-sm font-medium text-gray-600">Import from Excel</p>
                                    <p className="text-xs text-gray-400">.xlsx, .xls</p>
                                </>
                            )}
                            <input type="file" className="hidden" accept=".xlsx,.xls" onChange={handleFileUpload} disabled={isParsing} />
                        </label>
                    </div>

                    {/* Candidate List */}
                    {candidateEmails.length > 0 && (
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
                                <h3 className="font-bold text-gray-800">Review Candidates</h3>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                                    {candidateEmails.length} Candidates
                                </span>
                            </div>
                            <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                                {candidateEmails.map((email, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 group border border-transparent hover:border-gray-200 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-bold ring-1 ring-blue-100">
                                                {email.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-sm text-gray-700 font-medium truncate w-40 md:w-60">{email}</span>
                                        </div>
                                        <button onClick={() => removeEmail(email)} className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end pt-6">
                <button
                    onClick={handleNext}
                    className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold shadow-xl hover:shadow-blue-200 transition-all"
                >
                    Generate AI Prompt →
                </button>
            </div>
        </div>
    );
};

export default JobDetailsStep;
