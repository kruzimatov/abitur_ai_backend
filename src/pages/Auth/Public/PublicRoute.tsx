import { Navigate } from 'react-router-dom';

const PublicRoute = ({children}: any) => {

  const isAuth = localStorage.getItem("is_auth") === "true";

  if (isAuth) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicRoute;