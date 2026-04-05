import { useState, useEffect } from 'react';
import { Mail, UserPlus, Edit2, X, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const AddEmployeeForm = ({ onAddEmployee, onUpdateEmployee, editingEmployee, onCancelEdit }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Interviewer');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editingEmployee) {
            setEmail(editingEmployee.email);
            setRole(editingEmployee.role);
        } else {
            setEmail('');
            setRole('Interviewer');
        }
    }, [editingEmployee]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (editingEmployee) {
                await onUpdateEmployee({ email, role });
                toast.success(`Employee updated successfully: ${email}`);
            } else {
                await onAddEmployee({ email, role });
                toast.success(`Invitation sent to ${email}`);
            }

            if (!editingEmployee) {
                setEmail('');
            }
        } catch (error) {
            toast.error("Failed to process request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    {editingEmployee ? <Edit2 size={20} className="text-blue-600" /> : <UserPlus size={20} className="text-blue-600" />}
                    {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                </h2>
                {editingEmployee && (
                    <button onClick={onCancelEdit} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                )}
            </div>

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

                <div className="flex gap-2">
                    {editingEmployee && (
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            className="w-1/3 py-2 px-4 rounded-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium text-white transition-all
                            ${isSubmitting
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isSubmitting ? (
                            editingEmployee ? 'Updating...' : 'Sending Invite...'
                        ) : (
                            <>
                                {editingEmployee ? <Edit2 size={18} /> : <UserPlus size={18} />}
                                {editingEmployee ? 'Update Employee' : 'Send Verification Email'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddEmployeeForm;
