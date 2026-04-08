import { useState } from 'react';
import { Mail, User, Plus, X, Loader2, FileSpreadsheet } from 'lucide-react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

const CandidateInfoStep = ({ formData, setFormData, onNext }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [candidates, setCandidates] = useState(formData.candidates || []);
    const [isParsing, setIsParsing] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleAdd = (e) => {
        e.preventDefault();
        const trimEmail = email.trim().toLowerCase();
        const trimName = name.trim();

        if (!trimEmail) { toast.error('Please enter a candidate email'); return; }
        if (!emailRegex.test(trimEmail)) { toast.error('Please enter a valid email address'); return; }
        if (candidates.some(c => c.email === trimEmail)) { toast.warn('This email is already added'); return; }

        setCandidates([...candidates, { name: trimName, email: trimEmail }]);
        setName('');
        setEmail('');
        toast.success('Candidate added');
    };

    const handleRemove = (emailToRemove) => {
        setCandidates(candidates.filter(c => c.email !== emailToRemove));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const ext = file.name.split('.').pop().toLowerCase();
        if (!['xlsx', 'xls'].includes(ext)) { toast.error('Upload a valid Excel file (.xlsx or .xls)'); return; }

        setIsParsing(true);
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = new Uint8Array(ev.target.result);
                const wb = XLSX.read(data, { type: 'array' });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

                const existing = new Set(candidates.map(c => c.email));
                const newCandidates = [...candidates];
                let added = 0;

                rows.forEach(row => {
                    // Expect: [Name, Email] OR just [Email]
                    let candidateName = '';
                    let candidateEmail = '';
                    row.forEach((cell, i) => {
                        if (typeof cell === 'string') {
                            if (emailRegex.test(cell.trim())) {
                                candidateEmail = cell.trim().toLowerCase();
                            } else if (i === 0 && cell.trim().length > 0) {
                                candidateName = cell.trim();
                            }
                        }
                    });
                    if (candidateEmail && !existing.has(candidateEmail)) {
                        existing.add(candidateEmail);
                        newCandidates.push({ name: candidateName, email: candidateEmail });
                        added++;
                    }
                });

                if (added === 0) toast.warn('No new valid emails found in this file');
                else {
                    setCandidates(newCandidates);
                    toast.success(`Added ${added} candidate(s) from Excel`);
                }
            } catch {
                toast.error('Failed to parse Excel file');
            } finally {
                setIsParsing(false);
                e.target.value = '';
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleNext = () => {
        if (candidates.length === 0) { toast.error('Add at least one candidate to continue'); return; }
        setFormData({ ...formData, candidates });
        onNext();
    };

    return (
        <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">

                {/* ── Left: Manual Entry ── */}
                <div className="space-y-5">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            Add Candidate
                        </h2>

                        <form onSubmit={handleAdd} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                                    Candidate Name <span className="font-normal text-gray-400">(optional)</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="e.g., Ali Hassan"
                                        className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-gray-50 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                                    Candidate Email <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="e.g., ali@example.com"
                                        className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-gray-50 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
                            >
                                <Plus className="w-4 h-4" /> Add Candidate
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-5">
                            <div className="flex-1 h-px bg-gray-100" />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">or import</span>
                            <div className="flex-1 h-px bg-gray-100" />
                        </div>

                        {/* Excel Upload */}
                        <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-all ${isParsing ? 'bg-blue-50 border-blue-400' : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'}`}>
                            {isParsing ? (
                                <Loader2 className="w-7 h-7 text-blue-500 animate-spin" />
                            ) : (
                                <>
                                    <FileSpreadsheet className="w-7 h-7 text-gray-400 mb-2" />
                                    <p className="text-sm font-semibold text-gray-600">Import from Excel</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Columns: Name (optional), Email</p>
                                </>
                            )}
                            <input type="file" className="hidden" accept=".xlsx,.xls" onChange={handleFileUpload} disabled={isParsing} />
                        </label>
                    </div>
                </div>

                {/* ── Right: Candidate List ── */}
                <div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-gray-800">Candidate List</h3>
                            {candidates.length > 0 && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                                    {candidates.length} Added
                                </span>
                            )}
                        </div>

                        {candidates.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                    <User className="w-8 h-8 text-gray-300" />
                                </div>
                                <p className="text-gray-500 font-medium text-sm">No candidates added yet</p>
                                <p className="text-gray-400 text-xs mt-1">Add candidates manually or import from Excel</p>
                            </div>
                        ) : (
                            <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
                                {candidates.map((c, i) => (
                                    <div key={i} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 group transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                                {(c.name || c.email).charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800 leading-tight">
                                                    {c.name || <span className="text-gray-400 italic font-normal">No name</span>}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate max-w-[180px]">{c.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemove(c.email)}
                                            className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-2">
                <button
                    onClick={handleNext}
                    className="px-10 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 active:scale-95 transition-all"
                >
                    Next: Configure Interview →
                </button>
            </div>
        </div>
    );
};

export default CandidateInfoStep;
