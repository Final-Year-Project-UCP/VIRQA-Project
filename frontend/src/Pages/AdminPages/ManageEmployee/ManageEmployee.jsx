import { useState } from 'react';
import { toast } from 'react-toastify';
import AddEmployeeForm from '../../../components/admin/ManageEmployee/AddEmployeeForm';
import EmployeeList from '../../../components/admin/ManageEmployee/EmployeeList';

const ManageEmployee = () => {
    // Initial mock data
    const [employees, setEmployees] = useState([
        { id: 1, email: 'john.doe@company.com', role: 'Interviewer', status: 'Verified' },
        { id: 2, email: 'sarah.hr@company.com', role: 'HR', status: 'Pending' },
        { id: 3, email: 'mike.dev@company.com', role: 'Interviewer', status: 'Verified' },
    ]);

    const [editingEmployee, setEditingEmployee] = useState(null);

    const handleAddEmployee = (newEmployee) => {
        const employee = {
            id: Date.now(),
            ...newEmployee,
            status: 'Pending' // Default status for new invites
        };
        setEmployees([employee, ...employees]);
    };

    const handleUpdateEmployee = (updatedData) => {
        setEmployees(employees.map(emp =>
            emp.id === editingEmployee.id ? { ...emp, ...updatedData } : emp
        ));
        setEditingEmployee(null);
    };

    const handleEditEmployee = (employee) => {
        setEditingEmployee(employee);
    };

    const handleToggleStatus = (id) => {
        setEmployees(employees.map(emp => {
            if (emp.id === id) {
                const newStatus = emp.status === 'Verified' ? 'Deactivated' : 'Verified';
                toast.info(`Employee status updated to ${newStatus}`);
                return { ...emp, status: newStatus };
            }
            return emp;
        }));
    };

    const handleDeleteEmployee = (id) => {
        if (window.confirm('Are you sure you want to remove this employee?')) {
            setEmployees(employees.filter(emp => emp.id !== id));
            toast.success('Employee removed successfully');
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
                    <EmployeeList
                        employees={employees}
                        onDelete={handleDeleteEmployee}
                        onEdit={handleEditEmployee}
                        onToggleStatus={handleToggleStatus}
                    />
                </div>
            </div>
        </div>
    );
};

export default ManageEmployee;
