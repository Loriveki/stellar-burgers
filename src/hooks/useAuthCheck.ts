import { useEffect } from 'react';
import { useDispatch, useSelector } from '../services/store';
import { getUserThunk } from '../services/reducers/authSlice';
import { selectIsAuthenticated } from '../services/reducers/authSlice';
import { getCookie } from '../utils/cookie';

export const useAuthCheck = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    const token = getCookie('accessToken');
    if (!isAuthenticated && token) {
      dispatch(getUserThunk());
    }
  }, []);
};
