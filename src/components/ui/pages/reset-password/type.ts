import { ChangeEvent } from 'react';
import { PageUIProps } from '../common-type';

export type ResetPasswordUIProps = Omit<PageUIProps, 'email' | 'setEmail'> & {
  password: string;
  token: string;
  setPassword: (e: ChangeEvent<HTMLInputElement>) => void;
  setToken: (e: ChangeEvent<HTMLInputElement>) => void;
};
