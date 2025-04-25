import { ChangeEvent } from 'react';
import { PageUIProps } from '../common-type';

export type RegisterUIProps = PageUIProps & {
  password: string;
  userName: string;
  setPassword: (e: ChangeEvent<HTMLInputElement>) => void;
  setUserName: (e: ChangeEvent<HTMLInputElement>) => void;
};
