import { FC, memo } from 'react';

import { OrdersListProps } from './type';
import { OrdersListUI, Preloader } from '@ui';
import { useSelector } from '../../services/store';
import { getIsLoading } from '../../services/slices/allOrdersSlice';

export const OrdersList: FC<OrdersListProps> = memo(({ orders }) => {
  const isLoading = useSelector(getIsLoading);
  const orderByDate = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  if (isLoading) {
    return <Preloader />;
  } else {
    return <OrdersListUI orderByDate={orderByDate} />;
  }
});
