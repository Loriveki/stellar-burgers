import { FormEvent, ChangeEvent } from 'react';

export interface PageUIProps {
  errorText: string;
  email: string;
  setEmail: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}
