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
  const PASSWORD_PLACEHOLDER = '********';

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: PASSWORD_PLACEHOLDER
  });
  const [initialPassword, setInitialPassword] = useState('');
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);

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
        password: prevState.password || PASSWORD_PLACEHOLDER
      }));
    }
  }, [user]);

  const isFormChanged =
    (user && formValue.name !== user.name) ||
    (user && formValue.email !== user.email) ||
    (isPasswordChanged && formValue.password !== initialPassword);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const passwordToSend =
      isPasswordChanged && formValue.password !== PASSWORD_PLACEHOLDER
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
      password: initialPassword || PASSWORD_PLACEHOLDER
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
      if (!initialPassword) {
        setInitialPassword(value);
      }
      setIsPasswordChanged(
        value !== PASSWORD_PLACEHOLDER && value !== initialPassword
      );
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
    />
  );
};
