import { FC, useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  registerUserThunk,
  loginUserThunk
} from '../../services/reducers/authSlice';
import { Preloader } from '@ui';
import { selectAuthLoading } from '../../services/reducers/authSlice';
import { RegisterUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import { useForm } from '../../hooks/useForm';

export const Register: FC = () => {
  const [form, handleChange] = useForm({
    userName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectAuthLoading);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await dispatch(
        registerUserThunk({
          email: form.email,
          name: form.userName,
          password: form.password
        })
      ).unwrap();
      await dispatch(
        loginUserThunk({ email: form.email, password: form.password })
      ).unwrap();
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setError((err as Error).message || 'Произошла ошибка при регистрации');
    }
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText={error || ''}
      email={form.email}
      userName={form.userName}
      password={form.password}
      setEmail={(e) => handleChange(e)}
      setPassword={(e) => handleChange(e)}
      setUserName={(e) => handleChange(e)}
      handleSubmit={handleSubmit}
    />
  );
};
