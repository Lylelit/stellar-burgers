import { ProfileUI } from '@ui-pages';
import { selectAuth, selectUser, updateUser } from '@slices/authSlice';
import { useDispatch, useSelector } from '@services/store';
import { type SyntheticEvent, useEffect, useState } from 'react';

export const Profile = (): React.JSX.Element => {
  const user = useSelector(selectUser);
  const { updateUserError } = useSelector(selectAuth);
  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || '',
    }));
  }, [user?.name, user?.email]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    const data = {
      name: formValue.name.trim(),
      email: formValue.email.trim(),
      ...(formValue.password ? { password: formValue.password } : {}),
    };
    void dispatch(updateUser(data))
      .unwrap()
      .then(({ user: updatedUser }) => {
        setFormValue({
          name: updatedUser.name,
          email: updatedUser.email,
          password: '',
        });
      })
      .catch(() => undefined);
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={updateUserError || undefined}
    />
  );
};
