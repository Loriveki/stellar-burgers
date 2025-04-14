import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch } from 'react-redux'; // Используем кастомный useDispatch
import { useNavigate, useLocation } from 'react-router-dom';
import {
  registerUserThunk,
  loginUserThunk
} from '../../services/reducers/authSlice'; // Твоя асинхронная логика для регистрации
import { Preloader } from '@ui'; // Компонент загрузки
import {
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError
} from '../../services/reducers/authSlice';
import { RegisterUI } from '@ui-pages'; // Компонент UI для регистрации
import { AppDispatch, useSelector } from '../../services/store'; // Тип для dispatch

export const Register: FC = () => {
  const [userName, setUserName] = useState(''); // Состояние имени пользователя
  const [email, setEmail] = useState(''); // Состояние email
  const [password, setPassword] = useState(''); // Состояние пароля

  const navigate = useNavigate(); // Для навигации
  const dispatch = useDispatch<AppDispatch>(); // Используем кастомный useDispatch
  const isAuthenticated = useSelector(selectIsAuthenticated); // Статус авторизации
  const isLoading = useSelector(selectAuthLoading); // Статус загрузки
  const error = useSelector(selectAuthError);

  // Если пользователь уже авторизован, перенаправить его на главную
  if (isAuthenticated) {
    navigate('/');
  }

  // Обработчик отправки формы
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      // Пытаемся зарегистрировать пользователя
      const response = await dispatch(
        registerUserThunk({ email, name: userName, password })
      ).unwrap();
      await dispatch(loginUserThunk({ email, password })).unwrap();
      navigate('/');
    } catch (error) {
      // Обработка ошибок регистрации
      console.error('Ошибка регистрации:', error);
    }
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
