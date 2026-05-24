import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

type Role = 'student' | 'teacher' | 'admin';

const fallbackByRole: Record<Role, string> = {
  student: '/dashboard',
  teacher: '/teacher-dashboard',
  admin: '/admin-dashboard',
};

const RoleRoute = ({ children, roles }: { children: React.ReactNode; roles: Role[] }) => {
  const { user } = useAuth();
  const role = user?.role;

  if (!role || !roles.includes(role)) {
    return <Navigate to={role ? fallbackByRole[role] : '/login'} replace />;
  }

  return children;
};

export default RoleRoute;
