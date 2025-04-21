import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUserThunk, selectUser } from '../../services/reducers/authSlice';
import { Preloader } from '@ui';
import {
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError
} from '../../services/reducers/authSlice';
import { LoginUI } from '@ui-pages';
import { useSelector } from '../../services/store';
import { AppDispatch } from '../../services/types';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (isAuthenticated && user) {
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location.state]);

  // Обработчик отправки формы
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    await dispatch(loginUserThunk({ email, password })).unwrap();
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
