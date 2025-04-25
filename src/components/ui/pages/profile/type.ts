export type ProfileUIProps = {
  formValue: {
    name: string;
    email: string;
    password: string;
  };
  isFormChanged: boolean;
  updateUserError: string | null;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleCancel: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
