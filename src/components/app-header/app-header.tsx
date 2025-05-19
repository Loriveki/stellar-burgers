import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { selectUser } from '../../services/reducers/authSlice';
import { useSelector } from '../../services/store';
import { useLocation } from 'react-router-dom';

export const AppHeader: FC = () => {
  const user = useSelector(selectUser);
  const location = useLocation();

  return <AppHeaderUI userName={user?.name} currentPath={location.pathname} />;
};
