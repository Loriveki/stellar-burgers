import { FC, useEffect, FormEvent } from 'react';
import { Preloader } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectUser,
  updateUserThunk,
  selectAuthError,
  selectAuthLoading
} from '../../services/reducers/authSlice';
import { ProfileUI } from '@ui-pages';
import { useForm } from '../../hooks/useForm';

export const Profile: FC = () => {
  const user = useSelector(selectUser);
  const error = useSelector(selectAuthError);
  const isLoading = useSelector(selectAuthLoading);
  const dispatch = useDispatch();
  const PASSWORD_PLACEHOLDER = '********';

  const [formValue, handleChange, setForm] = useForm({
    name: user?.name || '',
    email: user?.email || '',
    password: PASSWORD_PLACEHOLDER
  });

  // Инициализация формы при монтировании или изменении user
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        password: PASSWORD_PLACEHOLDER
      });
    }
  }, [user, setForm]);

  const isPasswordChanged = formValue.password !== PASSWORD_PLACEHOLDER;

  const isFormChanged =
    (user && formValue.name !== user.name) ||
    (user && formValue.email !== user.email) ||
    (isPasswordChanged && formValue.password !== '');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const passwordToSend =
      isPasswordChanged && formValue.password ? formValue.password : '';
    await dispatch(
      updateUserThunk({
        name: formValue.name,
        email: formValue.email,
        password: passwordToSend
      })
    );
  };

  const handleCancel = (): void => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        password: PASSWORD_PLACEHOLDER
      });
    }
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={error}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleChange}
    />
  );
};
