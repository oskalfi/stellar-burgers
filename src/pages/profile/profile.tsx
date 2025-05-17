import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearErrorText,
  clearSuccessText,
  getErrorText,
  getSuccessText,
  getUserEmail,
  getUserName,
  updateUserData
} from '../../services/slices/userAuthSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();

  const userName = useSelector(getUserName);
  const userEmail = useSelector(getUserEmail);
  const errorText = useSelector(getErrorText);
  const successText = useSelector(getSuccessText);

  const user = {
    name: userName,
    email: userEmail
  };

  const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
    dispatch(clearSuccessText());
    dispatch(clearErrorText());
  }, [userName, userEmail, dispatch]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUserData(formValue));
    setFormValue((prevState) => ({
      ...prevState,
      password: ''
    }));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={errorText}
      updateUserSuccess={successText}
    />
  );
};
