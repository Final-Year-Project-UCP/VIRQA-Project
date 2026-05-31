import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AddEmployeeForm from '../../../components/admin/ManageEmployee/AddEmployeeForm';
import EmployeeList from '../../../components/admin/ManageEmployee/EmployeeList';
import { api, socket } from '../../../config/api.js';
import { getErrorMessage } from '../../../utils/errorParser';

const ManageEmployee = () => {
    const queryClient = useQueryClient();

    // Real-time sockets
    useEffect(() => {
        socket.on('employeeAdded', () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        });
        socket.on('employeeUpdated', () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        });
        socket.on('employeeDeleted', () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        });

        return () => {
            socket.off('employeeAdded');
            socket.off('employeeUpdated');
            socket.off('employeeDeleted');
        };
    }, [queryClient]);

    // Fetch Employees Data
    const { data: responseData, isLoading } = useQuery({
        queryKey: ['employees'],
        queryFn: async () => {
            const res = await api.get('admin/manage-employee');
            return res.data;
        }
    });

    const employees = (responseData?.data || []).map(emp => ({
        id: emp._id,
        email: emp.email,
        role: emp.jobTitle || 'Interviewer',
        status: emp.status || 'Pending'
    }));

    const [editingEmployee, setEditingEmployee] = useState(null);

    // Mutations
    const addMutation = useMutation({
        mutationFn: async (newEmployee) => {
            const response = await api.post('admin/add-employee', newEmployee);
            return response.data;
        },
        // Invalidation is mainly handled by socket, but we can do it here too as fallback
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
        onError: (err) => toast.error(getErrorMessage(err, 'Failed to add employee. Please try again.')),
    });

    const updateMutation = useMutation({
        mutationFn: async (updatedData) => {
            const payload = {
                oldEmail: editingEmployee.email, // backend depends on this
                email: updatedData.email,
                role: updatedData.role
            };
            await api.patch('admin/update-employee', payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            setEditingEmployee(null);
        },
        onError: (err) => toast.error(getErrorMessage(err, 'Failed to update employee. Please try again.')),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`admin/employee/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            toast.success('Employee removed successfully');
        },
        onError: (err) => toast.error(getErrorMessage(err, 'Failed to remove employee. Please try again.')),
    });

    const handleAddEmployee = async (newEmployee) => {
        return await addMutation.mutateAsync(newEmployee);
    };

    const handleUpdateEmployee = async (updatedData) => {
        await updateMutation.mutateAsync(updatedData);
    };

    const handleEditEmployee = (employee) => {
        setEditingEmployee(employee);
    };

    const handleToggleStatus = (id) => {
        toast.info(`Status logic not currently supported by backend endpoints!`);
    };

    const handleDeleteEmployee = async (id) => {
        if (window.confirm('Are you sure you want to remove this employee?')) {
            await deleteMutation.mutateAsync(id);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Manage Employees</h1>
                <p className="text-gray-600">Invite new members and manage team access</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Add Employee Form */}
                <div className="lg:col-span-1">
                    <AddEmployeeForm
                        onAddEmployee={handleAddEmployee}
                        onUpdateEmployee={handleUpdateEmployee}
                        editingEmployee={editingEmployee}
                        onCancelEdit={() => setEditingEmployee(null)}
                    />

                    {/* Info Card */}
                    <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-blue-800 mb-2">Did you know?</h3>
                        <p className="text-sm text-blue-600">
                            Adding an employee sends an automated verification email. They must click the link to activate their account.
                        </p>
                    </div>
                </div>

                {/* Right Column: Employee List */}
                <div className="lg:col-span-2">
                    {isLoading ? (
                        <div className="flex justify-center p-8 text-gray-500">Loading Employees...</div>
                    ) : (
                        <EmployeeList
                            employees={employees}
                            onDelete={handleDeleteEmployee}
                            onEdit={handleEditEmployee}
                            onToggleStatus={handleToggleStatus}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageEmployee;
