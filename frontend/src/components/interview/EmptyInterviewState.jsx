import { Calendar, Plus, Sparkles } from 'lucide-react';

const EmptyInterviewState = ({ onCreateNew }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="max-w-md text-center">
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="relative">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-12 h-12 text-blue-600" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-purple-600" />
                        </div>
                    </div>
                </div>

                {/* Message */}
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    No Interviews Scheduled Yet
                </h2>
                <p className="text-gray-600 mb-8">
                    Get started by creating your first AI-powered interview. Upload candidate emails,
                    generate custom prompts, and schedule interviews in just a few steps.
                </p>

                {/* CTA Button */}
                <button
                    onClick={onCreateNew}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                >
                    <Plus className="w-5 h-5" />
                    Create Your First Interview
                </button>

                {/* Tips */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Tips:</h3>
                    <ul className="text-sm text-gray-600 space-y-2 text-left">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>Prepare your job description and candidate list in Excel format</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>AI will generate customized interview prompts based on your job requirements</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>You can edit and refine the AI-generated prompts before scheduling</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default EmptyInterviewState;
