import { FC, useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPasswordThunk } from '../../services/reducers/authSlice';
import { ResetPasswordUI } from '@ui-pages';
import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import { selectAuthLoading } from '../../services/reducers/authSlice';
import { useDispatch } from '../../services/store';
import { useForm } from '../../hooks/useForm';

export const ResetPassword: FC = () => {
  const [form, handleChange] = useForm({ password: '', token: '' });
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectAuthLoading);

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await dispatch(
        resetPasswordThunk({ password: form.password, token: form.token })
      ).unwrap();
      localStorage.removeItem('resetPassword');
      navigate('/login');
    } catch (err) {
      setError((err as Error).message || 'Произошла ошибка при сбросе пароля');
    }
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <ResetPasswordUI
      errorText={error || ''}
      password={form.password}
      token={form.token}
      setPassword={(e) => handleChange(e)}
      setToken={(e) => handleChange(e)}
      handleSubmit={handleSubmit}
    />
  );
};
