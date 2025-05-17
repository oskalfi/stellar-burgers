import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';
import { useSelector } from '../../services/store';
import { isAuthChecked, userIsAuth } from '../../services/slices/userAuthSlice';
import { Preloader } from '@ui';

export const ResetPassword: FC = () => {
  const isAuth = useSelector(userIsAuth);
  const isUserAuthChecked = useSelector(isAuthChecked);

  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!password) setError('Создайте новый пароль');
    else {
      resetPasswordApi({ password, token })
        .then(() => {
          localStorage.removeItem('resetPassword');
          navigate('/login');
        })
        .catch((err) => setError(err));
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  if (!isUserAuthChecked) return <Preloader />;

  return isAuth ? (
    <Navigate to='/' />
  ) : (
    <ResetPasswordUI
      errorText={error}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
