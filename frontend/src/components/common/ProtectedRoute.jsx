import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const userRole = localStorage.getItem('userRole');

    if (!userRole) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.some(role => role.toLowerCase() === userRole.toLowerCase())) {
        // Redirect to a specific dashboard or unauthorized page based on role
        const role = userRole.toLowerCase();
        if (role === 'candidate') return <Navigate to="/api/v1/candidates" replace />;
        if (role === 'employee' || role === 'institute') return <Navigate to="/api/v1/employee/dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
