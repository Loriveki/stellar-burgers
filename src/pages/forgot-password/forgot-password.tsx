import { FC, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordThunk } from '../../services/reducers/authSlice';
import { ForgotPasswordUI } from '@ui-pages';
import { Preloader } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { selectAuthLoading } from '../../services/reducers/authSlice';
import { useForm } from '../../hooks/useForm';

export const ForgotPassword: FC = () => {
  const [form, handleChange] = useForm({ email: '' });
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectAuthLoading);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await dispatch(forgotPasswordThunk({ email: form.email })).unwrap();
      localStorage.setItem('resetPassword', 'true');
      navigate('/reset-password', { replace: true });
    } catch (err) {
      setError(
        (err as Error).message ||
          'Произошла ошибка при отправке запроса на восстановление пароля'
      );
    }
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <ForgotPasswordUI
      errorText={error || ''}
      email={form.email}
      setEmail={(e) => handleChange(e)}
      handleSubmit={handleSubmit}
    />
  );
};
