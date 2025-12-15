import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Edit3, Eye } from 'lucide-react';
import { toast } from 'react-toastify';

const AIPromptStep = ({ formData, setFormData, onNext, onBack }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Generate AI prompt when component mounts
    useEffect(() => {
        if (!formData.aiPrompt) {
            generatePrompt();
        } else {
            setAiPrompt(formData.aiPrompt);
        }
    }, []);

    const generatePrompt = () => {
        setIsGenerating(true);

        // Simulate AI generation delay
        setTimeout(() => {
            const generatedPrompt = `You are an AI interviewer conducting a professional interview for the position of ${formData.jobTitle}.

Job Description:
${formData.jobDescription}

Your role is to:
1. Ask relevant technical and behavioral questions based on the job requirements
2. Evaluate the candidate's responses for technical accuracy, problem-solving skills, and cultural fit
3. Provide follow-up questions to dive deeper into the candidate's experience
4. Maintain a professional and friendly tone throughout the interview
5. Assess the candidate's communication skills and enthusiasm for the role

Interview Guidelines:
- Start with an introduction and make the candidate feel comfortable
- Ask 5-7 questions covering technical skills, past experience, and problem-solving abilities
- Listen carefully to responses and ask relevant follow-up questions
- Conclude with an opportunity for the candidate to ask questions
- Provide a comprehensive evaluation at the end

Number of Candidates: ${formData.candidateEmails?.length || 0}

Please conduct a thorough and fair interview that helps identify the best candidate for this position.`;

            setAiPrompt(generatedPrompt);
            setFormData({ ...formData, aiPrompt: generatedPrompt });
            setIsGenerating(false);
            toast.success('AI prompt generated successfully!');
        }, 1500);
    };

    const handleRegenerate = () => {
        if (window.confirm('Are you sure you want to regenerate the prompt? Any edits will be lost.')) {
            generatePrompt();
            setIsEditing(false);
        }
    };

    const handleNext = () => {
        if (!aiPrompt.trim()) {
            toast.error('Please generate an AI prompt first');
            return;
        }

        setFormData({ ...formData, aiPrompt });
        onNext();
    };

    return (
        <div className="space-y-6">
            {/* AI Prompt Display/Edit */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-800">AI Interview Prompt</h2>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${isEditing
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                }`}
                        >
                            {isEditing ? (
                                <>
                                    <Eye className="w-4 h-4" /> Preview
                                </>
                            ) : (
                                <>
                                    <Edit3 className="w-4 h-4" /> Edit
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleRegenerate}
                            disabled={isGenerating}
                            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                            Regenerate
                        </button>
                    </div>
                </div>

                {isGenerating ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Sparkles className="w-12 h-12 text-blue-600 animate-pulse mb-4" />
                        <p className="text-gray-600 font-medium">Generating AI prompt...</p>
                        <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
                    </div>
                ) : (
                    <div>
                        {isEditing ? (
                            <textarea
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none font-mono text-sm"
                                rows="20"
                            />
                        ) : (
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
                                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                                    {aiPrompt}
                                </pre>
                            </div>
                        )}
                        <div className="mt-2 text-sm text-gray-500 text-right">
                            {aiPrompt.length} characters
                        </div>
                    </div>
                )}
            </div>

            {/* Prompt Details Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Prompt Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-600">Position:</span>
                        <p className="font-medium text-gray-900">{formData.jobTitle}</p>
                    </div>
                    <div>
                        <span className="text-gray-600">Candidates:</span>
                        <p className="font-medium text-gray-900">{formData.candidateEmails?.length || 0} emails</p>
                    </div>
                    <div className="col-span-2">
                        <span className="text-gray-600">Job Description Length:</span>
                        <p className="font-medium text-gray-900">{formData.jobDescription.length} characters</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
                <button
                    onClick={onBack}
                    className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
                >
                    ← Back
                </button>
                <button
                    onClick={handleNext}
                    disabled={isGenerating}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                    Continue to Scheduling →
                </button>
            </div>
        </div>
    );
};

export default AIPromptStep;
