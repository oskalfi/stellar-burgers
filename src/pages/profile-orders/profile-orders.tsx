import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchUserOrdersHistory,
  getUserOrdersHistory
} from '../../services/slices/userOrdersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(getUserOrdersHistory);

  useEffect(() => {
    dispatch(fetchUserOrdersHistory());
  });

  return <ProfileOrdersUI orders={orders} />;
};
