import { Trash2, Edit2, MoreVertical, Smartphone, Mail, Shield } from 'lucide-react';

const EmployeeList = ({ employees, onDelete, onEdit, onToggleStatus }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">Employee List</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {employees.map((employee) => (
                            <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-medium">
                                            {employee.email[0].toUpperCase()}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {employee.email.split('@')[0]}
                                            </div>
                                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                                <Mail size={12} />
                                                {employee.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Shield size={16} className="text-gray-400" />
                                        <span className="text-sm text-gray-700">{employee.role}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => onToggleStatus(employee.id)}
                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer hover:opacity-80 transition-opacity
                                        ${employee.status === 'Verified'
                                                ? 'bg-green-100 text-green-800'
                                                : employee.status === 'Deactivated'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                        title="Click to toggle status"
                                    >
                                        {employee.status}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            onClick={() => onEdit(employee)}
                                            className="text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(employee.id)}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {employees.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No employees found. Invite some team members!
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeList;
