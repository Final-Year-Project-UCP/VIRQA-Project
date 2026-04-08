import { useState } from 'react';
import { CheckCircle2, Circle, CheckSquare, Square, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const QuestionSelectionStep = ({ formData, setFormData, onNext, onBack }) => {
    const allQuestions = formData.generatedQuestions || [];
    const [selected, setSelected] = useState(new Set(formData.selectedQuestions || allQuestions));

    const toggleQuestion = (q) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(q)) next.delete(q);
            else next.add(q);
            return next;
        });
    };

    const selectAll = () => setSelected(new Set(allQuestions));
    const deselectAll = () => setSelected(new Set());

    const handleNext = () => {
        if (selected.size === 0) {
            toast.error('Please select at least one question');
            return;
        }
        // Preserve original order from generated list
        const ordered = allQuestions.filter(q => selected.has(q));
        setFormData({ ...formData, selectedQuestions: ordered });
        onNext();
    };

    const selectedCount = selected.size;
    const totalCount = allQuestions.length;
    const progress = totalCount > 0 ? (selectedCount / totalCount) * 100 : 0;

    return (
        <div className="max-w-3xl mx-auto space-y-5">

            {/* Header bar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-indigo-500" />
                            Select Questions for Interview
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">Choose which questions to include. You can deselect any you don't need.</p>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-black text-blue-600">{selectedCount}</span>
                        <span className="text-gray-400 font-medium text-sm"> / {totalCount}</span>
                        <p className="text-xs text-gray-400">selected</p>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Bulk actions */}
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={selectAll}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-100 transition-all"
                    >
                        <CheckSquare className="w-4 h-4" /> Select All
                    </button>
                    <button
                        onClick={deselectAll}
                        className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all"
                    >
                        <Square className="w-4 h-4" /> Deselect All
                    </button>
                </div>
            </div>

            {/* Questions list */}
            {allQuestions.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
                    <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                    <p className="font-bold text-amber-700">No questions generated yet</p>
                    <p className="text-sm text-amber-600 mt-1">Go back and click "Generate Questions"</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-50">
                        {allQuestions.map((q, i) => {
                            const isSelected = selected.has(q);
                            return (
                                <div
                                    key={i}
                                    onClick={() => toggleQuestion(q)}
                                    className={`flex items-start gap-4 px-6 py-4 cursor-pointer transition-all group
                                        ${isSelected ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                                >
                                    {/* Checkbox */}
                                    <div className={`flex-shrink-0 mt-0.5 transition-all ${isSelected ? 'text-blue-600 scale-110' : 'text-gray-300 group-hover:text-gray-400'}`}>
                                        {isSelected ? (
                                            <CheckCircle2 className="w-5 h-5" />
                                        ) : (
                                            <Circle className="w-5 h-5" />
                                        )}
                                    </div>

                                    {/* Question Number Badge */}
                                    <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all
                                        ${isSelected ? 'bg-blue-600 text-white shadow-sm shadow-blue-200' : 'bg-gray-100 text-gray-500'}`}
                                    >
                                        {i + 1}
                                    </div>

                                    {/* Question Text */}
                                    <p className={`text-sm leading-relaxed flex-1 font-medium transition-colors
                                        ${isSelected ? 'text-gray-800' : 'text-gray-500'}`}
                                    >
                                        {q}
                                    </p>

                                    {/* Selected indicator */}
                                    {isSelected && (
                                        <span className="flex-shrink-0 text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                                            Selected
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Selected questions summary */}
            {selectedCount > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-sm text-green-700 font-semibold">
                        <span className="font-black">{selectedCount}</span> question{selectedCount !== 1 ? 's' : ''} selected and will be used in this interview.
                    </p>
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-2">
                <button onClick={onBack} className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all">
                    ← Back
                </button>
                <button
                    onClick={handleNext}
                    disabled={selectedCount === 0}
                    className="px-10 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:shadow-green-300 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    Next: Schedule Interview →
                </button>
            </div>
        </div>
    );
};

export default QuestionSelectionStep;
