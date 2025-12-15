import { useState } from 'react';
import { Mail, UserPlus, CheckCircle } from 'lucide-react';

const AddEmployeeForm = ({ onAddEmployee }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Interviewer');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        onAddEmployee({ email, role });

        setIsSubmitting(false);
        setSuccess(true);
        setEmail('');

        // Reset success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <UserPlus size={20} className="text-blue-600" />
                Add New Employee
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="colleague@company.com"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                    </label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        <option value="Interviewer">Interviewer</option>
                        <option value="HR">HR Manager</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium text-white transition-all
                        ${isSubmitting
                            ? 'bg-blue-400 cursor-not-allowed'
                            : success
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {isSubmitting ? (
                        'Sending Invite...'
                    ) : success ? (
                        <>
                            <CheckCircle size={18} />
                            Invite Sent!
                        </>
                    ) : (
                        <>
                            <UserPlus size={18} />
                            Send Verification Email
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default AddEmployeeForm;
