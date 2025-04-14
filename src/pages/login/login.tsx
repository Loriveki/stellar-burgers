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
import { AppDispatch, useSelector } from '../../services/store';

export const Login: FC = () => {
  const [email, setEmail] = useState(''); // Состояние email
  const [password, setPassword] = useState(''); // Состояние пароля

  const navigate = useNavigate(); // Для навигации
  const location = useLocation(); // Для получения состояния с предыдущей страницы
  const dispatch = useDispatch<AppDispatch>(); // Используем кастомный useDispatch
  const isAuthenticated = useSelector(selectIsAuthenticated); // Статус авторизации
  const isLoading = useSelector(selectAuthLoading); // Статус загрузки
  const error = useSelector(selectAuthError);

  // Если пользователь уже авторизован, перенаправить его на главную
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
    try {
      // Пытаемся выполнить логин пользователя
      await dispatch(loginUserThunk({ email, password })).unwrap();
      // После успешной авторизации редиректим на страницу, с которой был перенаправлен
      const from = location.state?.from || '/'; // Если пришел с защищенной страницы, возвращаем туда
      navigate(from, { replace: true });
    } catch (error) {
      // Обработка ошибок авторизации
      console.error('Ошибка авторизации:', error);
    }
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
