import { FC, useState, SyntheticEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';
import { useSelector } from '../../services/store';
import { isAuthChecked, userIsAuth } from '../../services/slices/userAuthSlice';
import { Preloader } from '@ui';

export const ForgotPassword: FC = () => {
  const isAuth = useSelector(userIsAuth);
  const isUserAuthChecked = useSelector(isAuthChecked);

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email) setError('Напишите адрес электронной почты');
    else {
      forgotPasswordApi({ email })
        .then(() => {
          localStorage.setItem('resetPassword', 'true');
          navigate('/reset-password', { replace: true });
        })
        .catch((err) => setError(err));
    }
  };

  if (!isUserAuthChecked) return <Preloader />;

  return isAuth ? (
    <Navigate to='/' />
  ) : (
    <ForgotPasswordUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
