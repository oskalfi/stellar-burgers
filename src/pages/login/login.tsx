import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  getErrorText,
  isAuthChecked,
  setErrorText,
  tryLoginUser,
  userIsAuth
} from '../../services/slices/userAuthSlice';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const isAuth = useSelector(userIsAuth);
  const isUserAuthChecked = useSelector(isAuthChecked);

  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const errorText = useSelector(getErrorText);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || 'profile';

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!email || !password) {
      dispatch(setErrorText('Заполните все поля формы!'));
      return;
    }

    try {
      await dispatch(tryLoginUser({ email, password })).unwrap();
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch {
      dispatch(setErrorText('Ошибка авторизации. Проверьте данные.'));
    }
  };

  if (!isUserAuthChecked) {
    return null;
  }

  return isAuth ? (
    <Navigate to='/' />
  ) : (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
