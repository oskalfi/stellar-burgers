import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchAllOrders,
  getIsLoading,
  getOrdersData
} from '../../services/slices/allOrdersSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(getOrdersData);
  const isLoading = useSelector(getIsLoading);

  const handleGetFeeds = () => {
    dispatch(fetchAllOrders());
  };

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  } else {
    return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
  }
};
