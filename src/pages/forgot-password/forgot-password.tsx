import { useClearFormOnOpen } from '@hooks/use-clear-form-on-open';
import { ForgotPasswordUI } from '@ui-pages';
import {
  clearPasswordResetErrors,
  sendResetEmail,
  selectPasswordReset,
} from '@slices/passwordResetSlice';
import { useDispatch, useSelector } from '@services/store';
import { Preloader } from '@ui';
import { useState, type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export const ForgotPassword = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { forgotLoading, forgotError } = useSelector(selectPasswordReset);
  const [email, setEmail] = useState('');

  useClearFormOnOpen(() => {
    setEmail('');
    dispatch(clearPasswordResetErrors());
  });

  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(sendResetEmail({ email: email.trim() }))
      .unwrap()
      .then(() => {
        setEmail('');
        localStorage.setItem('resetPassword', 'true');
        void navigate('/reset-password', { replace: true });
      })
      .catch(() => undefined);
  };

  if (forgotLoading) return <Preloader />;

  return (
    <ForgotPasswordUI
      errorText={forgotError || undefined}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
