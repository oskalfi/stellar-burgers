import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  children: React.ReactElement;
  isAuth: boolean;
  authChecked: boolean;
};

export const ProtectedRoute = ({
  children,
  isAuth,
  authChecked
}: ProtectedRouteProps) => {
  const location = useLocation();

  if (!authChecked) return <Preloader />;

  return isAuth ? (
    children
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
};
