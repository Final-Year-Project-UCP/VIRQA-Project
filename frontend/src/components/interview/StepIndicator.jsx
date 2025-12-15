import { CheckCircle2, Circle } from 'lucide-react';

const StepIndicator = ({ currentStep, steps }) => {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-1">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${index < currentStep
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : index === currentStep
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-400'
                                }`}>
                                {index < currentStep ? (
                                    <CheckCircle2 className="w-6 h-6" />
                                ) : (
                                    <Circle className="w-6 h-6" fill={index === currentStep ? 'currentColor' : 'none'} />
                                )}
                            </div>
                            <div className={`mt-2 text-sm font-medium text-center ${index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                                }`}>
                                {step.title}
                            </div>
                            <div className={`text-xs text-center mt-1 ${index <= currentStep ? 'text-gray-600' : 'text-gray-400'
                                }`}>
                                {step.subtitle}
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`h-0.5 flex-1 mx-2 transition-all ${index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                                }`} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StepIndicator;
