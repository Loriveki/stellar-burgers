import { useState, ChangeEvent } from 'react';

export function useForm<T extends { [key: string]: string }>(initialForm: T) {
  const [form, setForm] = useState<T>(initialForm);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  }

  return [form, handleChange, setForm] as const;
}
