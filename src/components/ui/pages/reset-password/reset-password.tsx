import { FC } from 'react';
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

//Этот компонент реализует страницу восстановления пароля
export const ResetPasswordUI: FC<ResetPasswordUIProps> = ({
  errorText, // Сообщение об ошибке
  password, // Значение пароля
  setPassword, // Функция обновления пароля
  handleSubmit, // Функция обработки отправки формы
  token, // Токен (код подтверждения из письма)
  setToken // Функция обновления токена
}) => (
  <main className={styles.container}>
    <div className={`pt-6 ${styles.wrapCenter}`}>
      <h3 className='pb-6 text text_type_main-medium'>Восстановление пароля</h3>
      {/* Форма восстановления пароля */}
      <form
        className={`pb-15 ${styles.form}`}
        name='login'
        onSubmit={handleSubmit}
      >
        <div className='pb-6'>
          <PasswordInput
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            name='password'
          />
        </div>
        <div className='pb-6'>
          <Input
            type='text'
            placeholder='Введите код из письма'
            onChange={(e) => setToken(e.target.value)}
            value={token}
            name='token'
            error={false}
            errorText=''
            size='default'
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
