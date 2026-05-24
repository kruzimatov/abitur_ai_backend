import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const RoleDashboardRedirect = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'teacher':
      return <Navigate to="/teacher-dashboard" replace />;
    case 'admin':
      return <Navigate to="/admin-dashboard" replace />;
    default:
      return <Navigate to="/dashboard" replace />;
  }
};

export default RoleDashboardRedirect;
