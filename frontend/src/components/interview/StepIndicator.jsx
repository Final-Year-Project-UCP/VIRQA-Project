import { Check, User, Settings, Calendar } from 'lucide-react';

const STEP_ICONS = [User, Settings, Calendar];

const StepIndicator = ({ currentStep, steps }) => {
    return (
        <div className="mb-10 w-full px-4">
            <div className="flex items-center justify-between relative">
                {/* Horizontal Background Line */}
                <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-100 -z-0" />
                
                {steps.map((step, index) => {
                    const Icon = STEP_ICONS[index] || User;
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;
                    
                    return (
                        <div key={index} className="flex flex-col items-center relative z-10 gap-3">
                            {/* Connector Progress (Overlay) */}
                            {index > 0 && (
                                <div 
                                    className={`absolute top-6 -left-1/2 w-full h-0.5 transition-all duration-700 -z-0 ${isCompleted || isActive ? 'bg-blue-600' : 'bg-transparent'}`} 
                                    style={{ width: 'calc(100% - 3rem)', left: 'calc(-50% + 1.5rem)' }}
                                />
                            )}

                            {/* Inner Circle */}
                            <div
                                className={`flex items-center justify-center w-12 h-12 rounded-2xl border-2 transition-all duration-500 shadow-sm
                                    ${isCompleted
                                        ? 'bg-blue-600 border-blue-600 text-white translate-y-0 opacity-100'
                                        : isActive
                                            ? 'bg-white border-blue-600 text-blue-600 scale-110 shadow-[0_10px_20px_rgba(37,99,235,0.15)] translate-y-0.5'
                                            : 'bg-white border-gray-100 text-gray-300'
                                    }`}
                            >
                                {isCompleted ? (
                                    <Check className="w-5 h-5" strokeWidth={3} />
                                ) : (
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-300'}`} />
                                )}
                            </div>

                            {/* Labels */}
                            <div className="text-center min-w-[120px]">
                                <p className={`text-[13px] font-black tracking-tight transition-colors duration-300 uppercase ${isActive ? 'text-blue-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {step.title}
                                </p>
                                <p className={`text-[10px] font-bold mt-0.5 tracking-wide transition-colors duration-300 uppercase ${isActive ? 'text-blue-400' : 'text-gray-400'}`}>
                                    {step.subtitle}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StepIndicator;
