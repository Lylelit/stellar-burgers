import { LoginUI } from '@ui-pages';
import { useClearFormOnOpen } from '@hooks/use-clear-form-on-open';
import { clearAuthError, login, selectAuth } from '@slices/authSlice';
import { useDispatch, useSelector } from '@services/store';
import { Preloader } from '@ui';
import { type SyntheticEvent, useState } from 'react';

export const Login = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { isLoading, loginError } = useSelector(selectAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useClearFormOnOpen(() => {
    dispatch(clearAuthError());
    setEmail('');
    setPassword('');
  });

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(login({ email: email.trim(), password }))
      .unwrap()
      .then(() => {
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

  if (isLoading) return <Preloader />;

  return (
    <LoginUI
      errorText={loginError ?? ''}
      email={email}
      setEmail={handleEmailChange}
      password={password}
      setPassword={handlePasswordChange}
      handleSubmit={handleSubmit}
    />
  );
};
