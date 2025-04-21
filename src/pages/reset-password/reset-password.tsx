import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<Error | null>(null);

  // Обработчик отправки формы сброса пароля
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    resetPasswordApi({ password, token })
      .then(() => {
        localStorage.removeItem('resetPassword');
        navigate('/login');
      })
      .catch((err) => setError(err));
  };

  // Проверяем, есть ли в localStorage флаг сброса пароля
  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error?.message} // Передаем сообщение об ошибке
      password={password} // Передаем текущее значение пароля
      token={token} // Передаем текущий токен
      setPassword={setPassword} // Функция для обновления пароля
      setToken={setToken} // Функция для обновления токена
      handleSubmit={handleSubmit} // Функция отправки формы
    />
  );
};
