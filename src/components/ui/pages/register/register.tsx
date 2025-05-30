import { FC, ChangeEvent } from 'react';
import {
  Input as BaseInput,
  Button,
  PasswordInput
} from '@zlden/react-developer-burger-ui-components';
import styles from '../common.module.css';
import { Link } from 'react-router-dom';
import { RegisterUIProps } from './type';

interface CustomInputProps
  extends Omit<
    React.ComponentProps<typeof BaseInput>,
    'onPointerEnterCapture' | 'onPointerLeaveCapture'
  > {
  onPointerEnterCapture?: (event: React.PointerEvent<HTMLInputElement>) => void;
  onPointerLeaveCapture?: (event: React.PointerEvent<HTMLInputElement>) => void;
}

const Input = BaseInput as React.FC<CustomInputProps>;

export const RegisterUI: FC<RegisterUIProps> = ({
  errorText,
  email,
  setEmail,
  handleSubmit,
  password,
  setPassword,
  userName,
  setUserName
}) => (
  <main className={styles.container}>
    <div className={`pt-6 ${styles.wrapCenter}`}>
      <h3 className='pb-6 text text_type_main-medium'>Регистрация</h3>
      <form
        className={`pb-15 ${styles.form}`}
        name='register'
        onSubmit={handleSubmit}
      >
        <div className='pb-6'>
          <Input
            type='text'
            placeholder='Имя'
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUserName(e)}
            value={userName}
            name='userName'
            error={false}
            errorText=''
            size='default'
            autoComplete='given-name'
          />
        </div>
        <div className='pb-6'>
          <Input
            type='email'
            placeholder='E-mail'
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e)}
            value={email}
            name='email'
            error={false}
            errorText=''
            size='default'
            autoComplete='email'
          />
        </div>
        <div className='pb-6'>
          <PasswordInput
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e)}
            value={password}
            name='password'
            autoComplete='new-password'
          />
        </div>
        <div className={`pb-6 ${styles.button}`}>
          <Button type='primary' size='medium' htmlType='submit'>
            Зарегистрироваться
          </Button>
        </div>
        {errorText && (
          <p className={`${styles.error} text text_type_main-default pb-6`}>
            {errorText}
          </p>
        )}
      </form>
      <div className={`${styles.question} text text_type_main-default pb-6`}>
        Уже зарегистрированы?
        <Link to='/login' className={`pl-2 ${styles.link}`}>
          Войти
        </Link>
      </div>
    </div>
  </main>
);
