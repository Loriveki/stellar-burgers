import { FC, ChangeEvent } from 'react';
import {
  Input as BaseInput,
  Button,
  PasswordInput
} from '@zlden/react-developer-burger-ui-components';
import styles from '../common.module.css';
import { Link } from 'react-router-dom';
import { ResetPasswordUIProps } from './type';

interface CustomInputProps
  extends Omit<
    React.ComponentProps<typeof BaseInput>,
    'onPointerEnterCapture' | 'onPointerLeaveCapture'
  > {
  onPointerEnterCapture?: (event: React.PointerEvent<HTMLInputElement>) => void;
  onPointerLeaveCapture?: (event: React.PointerEvent<HTMLInputElement>) => void;
}

const Input = BaseInput as React.FC<CustomInputProps>;

export const ResetPasswordUI: FC<ResetPasswordUIProps> = ({
  errorText,
  password,
  setPassword,
  handleSubmit,
  token,
  setToken
}) => (
  <main className={styles.container}>
    <div className={`pt-6 ${styles.wrapCenter}`}>
      <h3 className='pb-6 text text_type_main-medium'>Восстановление пароля</h3>
      <form
        className={`pb-15 ${styles.form}`}
        name='login'
        onSubmit={handleSubmit}
      >
        <div className='pb-6'>
          <PasswordInput
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e)}
            value={password}
            name='password'
            autoComplete='new-password'
          />
        </div>
        <div className='pb-6'>
          <Input
            type='text'
            placeholder='Введите код из письма'
            onChange={(e: ChangeEvent<HTMLInputElement>) => setToken(e)}
            value={token}
            name='token'
            error={false}
            errorText=''
            size='default'
            autoComplete='one-time-code'
          />
        </div>
        <div className={`pb-6 ${styles.button}`}>
          <Button type='primary' size='medium' htmlType='submit'>
            Сохранить
          </Button>
        </div>
        {errorText && (
          <p className={`${styles.error} text text_type_main-default pb-6`}>
            {errorText}
          </p>
        )}
      </form>
      <div className={`${styles.question} text text_type_main-default pb-6`}>
        Вспомнили пароль?
        <Link to='/login' className={`pl-2 ${styles.link}`}>
          Войти
        </Link>
      </div>
    </div>
  </main>
);
