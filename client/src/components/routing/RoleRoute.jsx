import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const RoleRoute = ({ requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-state">Loading application...</div>;
  }

  // Ensure user exists and role exactly matches the required string
  if (!user || user.role !== requiredRole) {
    // If not authorized for this role, redirect to a generic home or login
    // Depending on their actual role, we can route them properly
    if (user && user.role === 'AGENT') return <Navigate to="/agent/dashboard" replace />;
    if (user && user.role === 'CUSTOMER') return <Navigate to="/customer/dashboard" replace />;
    
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
