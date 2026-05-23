import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: any) => {
  const isAuth = localStorage.getItem("is_auth")

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;