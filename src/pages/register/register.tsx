import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  getErrorText,
  isAuthChecked,
  registerAttempt,
  setErrorText,
  userIsAuth
} from '../../services/slices/userAuthSlice';
import { Preloader } from '@ui';
import { Navigate } from 'react-router-dom';

export const Register: FC = () => {
  const isAuth = useSelector(userIsAuth);
  const isUserAuthChecked = useSelector(isAuthChecked);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const errorText = useSelector(getErrorText);

  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (userName.length === 0 || email.length === 0 || password.length === 0) {
      dispatch(setErrorText('Заполните все поля формы'));
    } else {
      dispatch(setErrorText(''));
      const data = {
        name: userName,
        email: email,
        password: password
      };
      dispatch(registerAttempt(data));
    }
  };

  if (!isUserAuthChecked) {
    return <Preloader />;
  }

  return isAuth ? (
    <Navigate to='/' />
  ) : (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
