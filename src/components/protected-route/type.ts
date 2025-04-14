import { ReactNode } from 'react';

export type ProtectedRouteProps = {
  children: ReactNode;
  onlyUnAuth?: boolean; // если true — защищён от авторизованных
};
