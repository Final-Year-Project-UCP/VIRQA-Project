import { Check } from 'lucide-react';

const StepIndicator = ({ currentStep, steps }) => {
    return (
        <div className="mb-8">
            <div className="flex items-center w-full">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center flex-1">
                        {/* Step Circle + Label */}
                        <div className="flex flex-col items-center flex-shrink-0">
                            <div
                                className={`flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-300 text-sm font-black
                                    ${index < currentStep
                                        ? 'bg-green-500 border-green-500 text-white shadow-md shadow-green-200'
                                        : index === currentStep
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200 scale-110'
                                            : 'bg-white border-gray-200 text-gray-400'
                                    }`}
                            >
                                {index < currentStep ? (
                                    <Check className="w-4 h-4" strokeWidth={3} />
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </div>
                            <div className="mt-2 text-center w-20">
                                <p className={`text-xs font-bold leading-tight transition-colors ${index <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {step.title}
                                </p>
                                <p className={`text-[10px] mt-0.5 leading-tight ${index <= currentStep ? 'text-gray-500' : 'text-gray-300'}`}>
                                    {step.subtitle}
                                </p>
                            </div>
                        </div>

                        {/* Connector line */}
                        {index < steps.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-2 mb-7 transition-all duration-500 ${index < currentStep ? 'bg-green-400' : 'bg-gray-200'}`} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StepIndicator;
