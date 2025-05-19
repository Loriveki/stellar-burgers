import { FC, useState } from 'react';
import {
  Button,
  Input as BaseInput
} from '@zlden/react-developer-burger-ui-components';
import styles from './profile.module.css';
import commonStyles from '../common.module.css';
import { ProfileUIProps } from './type';
import { ProfileMenu } from '@components';

interface CustomInputProps
  extends Omit<
    React.ComponentProps<typeof BaseInput>,
    'onPointerEnterCapture' | 'onPointerLeaveCapture'
  > {
  onPointerEnterCapture?: (event: React.PointerEvent<HTMLInputElement>) => void;
  onPointerLeaveCapture?: (event: React.PointerEvent<HTMLInputElement>) => void;
}

const Input = BaseInput as React.FC<CustomInputProps>;

export const ProfileUI: FC<ProfileUIProps> = ({
  formValue,
  isFormChanged,
  updateUserError,
  handleSubmit,
  handleCancel,
  handleInputChange
}) => {
  // Состояние для управления режимом редактирования каждого поля
  const [editableFields, setEditableFields] = useState({
    name: false,
    email: false,
    password: false
  });

  // Обработчик клика по иконке EditIcon
  const handleIconClick = (field: keyof typeof editableFields) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Обёртка для handleSubmit, чтобы сбросить editableFields после сохранения
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    await handleSubmit(e);
    setEditableFields({
      name: false,
      email: false,
      password: false
    });
  };

  // Обёртка для handleCancel, чтобы сбросить editableFields после отмены
  const onCancel = () => {
    handleCancel();
    setEditableFields({
      name: false,
      email: false,
      password: false
    });
  };

  return (
    <main className={`${commonStyles.container}`}>
      <div className={`mt-30 mr-15 ${styles.menu}`}>
        <ProfileMenu />
      </div>
      <form
        className={`mt-30 ${styles.form} ${commonStyles.form}`}
        onSubmit={onSubmit}
        name='profile-form'
      >
        <div className='pb-6'>
          <Input
            type='text'
            placeholder='Имя'
            onChange={handleInputChange}
            value={formValue.name}
            name='name'
            error={false}
            errorText=''
            size='default'
            autoComplete='given-name'
            icon='EditIcon'
            disabled={!editableFields.name}
            onIconClick={() => handleIconClick('name')}
          />
        </div>
        <div className='pb-6'>
          <Input
            type='email'
            placeholder='E-mail'
            onChange={handleInputChange}
            value={formValue.email}
            name='email'
            error={false}
            errorText=''
            size='default'
            autoComplete='email'
            icon='EditIcon'
            disabled={!editableFields.email}
            onIconClick={() => handleIconClick('email')}
          />
        </div>
        <div className='pb-6'>
          <Input
            type='password'
            placeholder='Пароль'
            onChange={handleInputChange}
            value={formValue.password}
            name='password'
            error={false}
            errorText=''
            size='default'
            autoComplete='current-password'
            icon='EditIcon'
            disabled={!editableFields.password}
            onIconClick={() => handleIconClick('password')}
          />
        </div>
        {isFormChanged && (
          <div className={styles.button}>
            <Button
              type='secondary'
              htmlType='button'
              size='medium'
              onClick={onCancel}
            >
              Отменить
            </Button>
            <Button type='primary' size='medium' htmlType='submit'>
              Сохранить
            </Button>
          </div>
        )}
        {updateUserError && (
          <p
            className={`${commonStyles.error} pt-5 text text_type_main-default`}
          >
            {updateUserError}
          </p>
        )}
      </form>
    </main>
  );
};
