import { FC, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUserThunk } from '../../services/reducers/authSlice';
import { Preloader } from '@ui';
import { selectAuthLoading } from '../../services/reducers/authSlice';
import { LoginUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import { useForm } from '../../hooks/useForm';

export const Login: FC = () => {
  const [form, handleChange] = useForm({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectAuthLoading);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await dispatch(
        loginUserThunk({ email: form.email, password: form.password })
      ).unwrap();
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setError((err as Error).message || 'Произошла ошибка при входе');
    }
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={error || ''}
      email={form.email}
      setEmail={(e) => handleChange(e)}
      password={form.password}
      setPassword={(e) => handleChange(e)}
      handleSubmit={handleSubmit}
    />
  );
};
