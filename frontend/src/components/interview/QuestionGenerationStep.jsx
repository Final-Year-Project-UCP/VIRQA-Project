import { useState } from 'react';
import { Sparkles, Zap, RefreshCw, Layers, Target, Gauge, BookOpen, Hash, List } from 'lucide-react';
import { toast } from 'react-toastify';
import { api } from '../../config/api.js';

const DIFFICULTY_BADGE = {
    Easy: 'bg-green-100 text-green-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Hard: 'bg-red-100 text-red-700',
};

const EXPERIENCE_BADGE = {
    Fresh: 'bg-purple-100 text-purple-700',
    Junior: 'bg-blue-100 text-blue-700',
    Mid: 'bg-orange-100 text-orange-700',
    Senior: 'bg-gray-100 text-gray-700',
};

const QuestionGenerationStep = ({ formData, setFormData, onNext, onBack }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [questions, setQuestions] = useState(formData.generatedQuestions || []);
    const [generationCount, setGenerationCount] = useState(0);

    const generateQuestions = async () => {
        setIsGenerating(true);
        try {
            const res = await api.post('employee/interview/generate-questions', {
                domain: formData.domain,
                skills: formData.skills,
                experienceLevel: formData.experienceLevel,
                difficulty: formData.difficulty,
                questionType: formData.questionType,
                numberOfQuestions: formData.numberOfQuestions,
            });

            const generated = res.data?.data?.questions || [];
            setQuestions(generated);
            setFormData({ ...formData, generatedQuestions: generated, selectedQuestions: [] });
            setGenerationCount(c => c + 1);
            toast.success(`${generated.length} questions generated!`);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to generate questions. Please retry.';
            toast.error(msg);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleNext = () => {
        if (questions.length === 0) {
            toast.error('Please generate questions first');
            return;
        }
        onNext();
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            {/* Config Summary Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Interview Configuration</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                        <Layers className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-gray-400">Domain</p>
                            <p className="text-sm font-bold text-gray-800 truncate">{formData.domain}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                        <Target className="w-4 h-4 text-purple-600 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-gray-400">Experience</p>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${EXPERIENCE_BADGE[formData.experienceLevel] || 'bg-gray-100 text-gray-700'}`}>
                                {formData.experienceLevel}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                        <Gauge className="w-4 h-4 text-orange-600 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-gray-400">Difficulty</p>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${DIFFICULTY_BADGE[formData.difficulty] || 'bg-gray-100 text-gray-700'}`}>
                                {formData.difficulty}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                        <BookOpen className="w-4 h-4 text-teal-600 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-gray-400">Question Type</p>
                            <p className="text-sm font-bold text-gray-800">{formData.questionType || 'Any'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                        <List className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-gray-400">Questions</p>
                            <p className="text-sm font-bold text-gray-800">{formData.numberOfQuestions}</p>
                        </div>
                    </div>
                    {formData.skills?.length > 0 && (
                        <div className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl col-span-2 md:col-span-1">
                            <Hash className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Skills</p>
                                <div className="flex flex-wrap gap-1">
                                    {formData.skills.slice(0, 3).map(s => (
                                        <span key={s} className="text-xs px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded font-medium">{s}</span>
                                    ))}
                                    {formData.skills.length > 3 && (
                                        <span className="text-xs text-gray-400">+{formData.skills.length - 3}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Generate Button */}
            <div className="text-center">
                <button
                    onClick={generateQuestions}
                    disabled={isGenerating}
                    className={`relative inline-flex items-center gap-3 px-12 py-4 rounded-2xl font-black text-lg transition-all shadow-2xl
                        ${isGenerating
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                            : 'bg-gradient-to-r from-violet-600 via-blue-600 to-indigo-600 text-white hover:shadow-indigo-300 active:scale-95 hover:scale-105'
                        }`}
                >
                    {isGenerating ? (
                        <>
                            <span className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            </span>
                            Generating Questions...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-6 h-6 animate-pulse" />
                            {generationCount === 0 ? 'Generate Questions with AI' : 'Re-Generate Questions'}
                            <Zap className="w-5 h-5" />
                        </>
                    )}
                </button>
                {generationCount > 0 && (
                    <p className="mt-2 text-sm text-gray-500 flex items-center justify-center gap-1">
                        <RefreshCw className="w-3 h-3" /> Generated {generationCount} time{generationCount > 1 ? 's' : ''}
                    </p>
                )}
            </div>

            {/* Loading Animation */}
            {isGenerating && (
                <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-indigo-100 rounded-2xl p-10 text-center">
                    <div className="flex justify-center mb-5">
                        <div className="relative">
                            <Sparkles className="w-16 h-16 text-indigo-400 animate-spin" style={{ animationDuration: '3s' }} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-6 h-6 bg-indigo-200 rounded-full animate-ping" />
                            </div>
                        </div>
                    </div>
                    <p className="text-indigo-700 font-bold text-lg">AI is crafting your questions...</p>
                    <p className="text-indigo-500 text-sm mt-1">Analyzing domain, skills, and difficulty level</p>
                    <div className="mt-5 flex justify-center gap-3">
                        {['Analyzing domain', 'Checking difficulty', 'Crafting questions'].map((txt, i) => (
                            <span key={txt} className="px-3 py-1.5 bg-white border border-indigo-200 rounded-full text-xs text-indigo-600 font-medium animate-pulse" style={{ animationDelay: `${i * 200}ms` }}>
                                {txt}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Generated Questions Preview */}
            {!isGenerating && questions.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-500" />
                            Generated Questions Preview
                        </h3>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                            {questions.length} questions
                        </span>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {questions.map((q, i) => (
                            <div key={i} className="flex gap-4 px-6 py-4">
                                <span className="w-6 h-6 flex-shrink-0 rounded-full bg-indigo-100 text-indigo-600 text-xs font-black flex items-center justify-center mt-0.5">
                                    {i + 1}
                                </span>
                                <p className="text-sm text-gray-700 leading-relaxed font-medium">{q}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-2">
                <button onClick={onBack} className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all">
                    ← Back
                </button>
                <button
                    onClick={handleNext}
                    disabled={questions.length === 0}
                    className="px-10 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    Next: Select Questions →
                </button>
            </div>
        </div>
    );
};

export default QuestionGenerationStep;
