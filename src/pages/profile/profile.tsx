import { FC, SyntheticEvent, useEffect, useState, useRef } from 'react';
import { Preloader } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectUser,
  getUserThunk,
  updateUserThunk,
  selectAuthError,
  selectAuthLoading
} from '../../services/reducers/authSlice';
import { ProfileUI } from '@ui-pages';

export const Profile: FC = () => {
  const user = useSelector(selectUser);
  const error = useSelector(selectAuthError);
  const isLoading = useSelector(selectAuthLoading);
  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: '********'
  });
  const [initialPassword, setInitialPassword] = useState('');
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      dispatch(getUserThunk());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      setFormValue((prevState) => ({
        ...prevState,
        name: user.name || '',
        email: user.email || '',
        password: prevState.password || '********'
      }));
    }
  }, [user]);

  // Захватываем автозаполнённый пароль после первого рендера
  useEffect(() => {
    const passwordField = passwordInputRef.current;
    if (
      passwordField &&
      passwordField.value &&
      passwordField.value !== '********'
    ) {
      setInitialPassword(passwordField.value);
      setFormValue((prevState) => ({
        ...prevState,
        password: passwordField.value
      }));
    }
  }, [passwordInputRef]);

  const isFormChanged =
    (user && formValue.name !== user.name) ||
    (user && formValue.email !== user.email) ||
    (isPasswordChanged && formValue.password !== initialPassword);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const passwordToSend =
      isPasswordChanged && formValue.password !== '********'
        ? formValue.password
        : '';
    dispatch(
      updateUserThunk({
        name: formValue.name,
        email: formValue.email,
        password: passwordToSend
      })
    );
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: initialPassword || '********'
    });
    setIsPasswordChanged(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prevState) => ({
      ...prevState,
      [name]: value
    }));
    if (name === 'password') {
      setIsPasswordChanged(value !== '********' && value !== initialPassword);
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
      handleInputChange={handleInputChange}
      passwordInputRef={passwordInputRef}
    />
  );
};
