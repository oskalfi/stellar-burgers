import { Preloader } from '@ui';
import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  children: React.ReactElement;
  isAuth: boolean;
  redirectPath: string;
  authChecked: boolean;
};

export const ProtectedRoute = ({
  children,
  isAuth,
  redirectPath,
  authChecked
}: ProtectedRouteProps) => {
  if (!authChecked) return <Preloader />;
  return !isAuth ? children : <Navigate to={redirectPath} />;
};
