import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  getErrorText,
  setErrorText,
  tryLoginUser
} from '../../services/slices/userAuthSlice';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const errorText = useSelector(getErrorText);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (email.length === 0 || password.length === 0) {
      dispatch(setErrorText('Заполните все поля формы!'));
    } else {
      const data = {
        email: email,
        password: password
      };
      dispatch(tryLoginUser(data));
    }
  };

  return (
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
