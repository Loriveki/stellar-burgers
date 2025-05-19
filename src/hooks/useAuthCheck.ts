import { useEffect } from 'react';
import { useDispatch } from '../services/store';
import { getUserThunk } from '../services/reducers/authSlice';

export const useAuthCheck = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserThunk());
  }, [dispatch]);
};
