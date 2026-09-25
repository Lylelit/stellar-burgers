import { RegisterUI } from '@ui-pages';
import { useClearFormOnOpen } from '@hooks/use-clear-form-on-open';
import { clearAuthError, register, selectAuth } from '@slices/authSlice';
import { useDispatch, useSelector } from '@services/store';
import { Preloader } from '@ui';
import { type SyntheticEvent, useState } from 'react';

export const Register = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { isLoading, registerError } = useSelector(selectAuth);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useClearFormOnOpen(() => {
    dispatch(clearAuthError());
    setUserName('');
    setEmail('');
    setPassword('');
  });

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(register({ name: userName, email: email.trim(), password }))
      .unwrap()
      .then(() => {
        setUserName('');
        setEmail('');
        setPassword('');
      })
      .catch(() => undefined);
  };

  const handleEmailChange: typeof setEmail = (value) => {
    dispatch(clearAuthError());
    setEmail(value);
  };

  const handlePasswordChange: typeof setPassword = (value) => {
    dispatch(clearAuthError());
    setPassword(value);
  };

  const handleNameChange: typeof setUserName = (value) => {
    dispatch(clearAuthError());
    setUserName(value);
  };

  if (isLoading) return <Preloader />;

  return (
    <RegisterUI
      errorText={registerError || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={handleEmailChange}
      setPassword={handlePasswordChange}
      setUserName={handleNameChange}
      handleSubmit={handleSubmit}
    />
  );
};
