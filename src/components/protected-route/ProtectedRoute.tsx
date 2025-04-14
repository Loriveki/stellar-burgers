import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  selectIsAuthenticated,
  selectAuthLoading
} from '../../services/reducers/authSlice';
import { ProtectedRouteProps } from './type';
import { Preloader } from '@ui';

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false
}: ProtectedRouteProps) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const location = useLocation();

  if (isLoading) {
    return <Preloader />;
  }

  // Защита от авторизованных пользователей (например, /login, /register)
  if (onlyUnAuth && isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  // Защита от неавторизованных пользователей (например, /profile)
  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
