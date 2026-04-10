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
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] p-8">
                        <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <User className="w-5 h-5 text-blue-600" />
                            </div>
                            Manual Entry
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
                        <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${isParsing ? 'bg-blue-50 border-blue-400' : 'border-gray-100 bg-gray-50/50 hover:border-blue-400 hover:bg-blue-50 hover:shadow-inner'}`}>
                            {isParsing ? (
                                <Loader2 className="w-7 h-7 text-blue-500 animate-spin" />
                            ) : (
                                <>
                                    <FileSpreadsheet className="w-8 h-8 text-blue-500/40 mb-2" />
                                    <p className="text-sm font-black text-gray-700 tracking-tight">Bulk Import (Excel)</p>
                                    <p className="text-[10px] uppercase font-black text-gray-400 mt-1 tracking-widest">Columns: Name, Email</p>
                                </>
                            )}
                            <input type="file" className="hidden" accept=".xlsx,.xls" onChange={handleFileUpload} disabled={isParsing} />
                        </label>
                    </div>
                </div>

                {/* ── Right: Candidate List ── */}
                <div className="h-full">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] overflow-hidden h-full flex flex-col">
                        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                            <div>
                                <h3 className="font-black text-gray-900 tracking-tight">Active Roster</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Ready for invitation</p>
                            </div>
                            {candidates.length > 0 && (
                                <span className="px-4 py-1.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg shadow-blue-200">
                                    {candidates.length} Registered
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
                                    <div key={i} className="flex items-center justify-between px-8 py-4 hover:bg-gray-50/80 group transition-all duration-300">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 flex items-center justify-center text-blue-600 text-sm font-black shadow-sm group-hover:scale-110 group-hover:bg-blue-50 transition-all">
                                                {(c.name || c.email).charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 leading-tight tracking-tight">
                                                    {c.name || <span className="text-gray-400 italic font-normal">No name provided</span>}
                                                </p>
                                                <p className="text-[11px] font-bold text-gray-400 truncate max-w-[200px] mt-0.5">{c.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemove(c.email)}
                                            className="p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 translate-x-2"
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
