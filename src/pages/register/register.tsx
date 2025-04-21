import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  registerUserThunk,
  loginUserThunk
} from '../../services/reducers/authSlice';
import { Preloader } from '@ui';
import {
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError
} from '../../services/reducers/authSlice';
import { RegisterUI } from '@ui-pages';
import { useSelector } from '../../services/store';
import { AppDispatch } from '../../services/types';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  // Если пользователь уже авторизован, перенаправить его на главную
  if (isAuthenticated) {
    navigate('/');
  }

  // Обработчик отправки формы
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    await dispatch(
      registerUserThunk({ email, name: userName, password })
    ).unwrap();
    await dispatch(loginUserThunk({ email, password })).unwrap();
    navigate('/');
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
