import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  getErrorText,
  registerAttempt,
  setErrorText
} from '../../services/slices/userAuthSlice';

export const Register: FC = () => {
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

  return (
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
