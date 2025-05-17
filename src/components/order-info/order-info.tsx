import { FC, useEffect, useMemo, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector } from '../../services/store';
import { getOrdersData } from '../../services/slices/allOrdersSlice';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getAllIngredients } from '../../services/slices/ingredientsSlice';
import { getOrderByNumberApi } from '@api';
import { Modal } from '../modal';

type TORderInfoProps = {
  isInModal?: boolean;
};

export const OrderInfo: FC<TORderInfoProps> = ({ isInModal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.background;
  const onClick = () => {
    if (backgroundLocation?.pathname) {
      navigate(backgroundLocation.pathname, { replace: true });
    } else {
      navigate(-1);
    }
  };

  const { number } = useParams() as { number: string };
  const order = useSelector(getOrdersData).find(
    (order) => order.number === Number(number)
  ); // получу данные заказа из массива, который прислал сервер
  const [orderData, setOrderData] = useState(order); // запишу их в state
  const ingredients: TIngredient[] = useSelector(getAllIngredients); // возьму все ингредиенты

  // функция, которую буду вызывать если заказ не был найден в массиве, который прислал сервер при инициализации приложения
  const fetchOrder = async () => {
    // функция, которая делает запрос на получение заказа по номеру, и сохраняет этот заказ в state
    const res = await getOrderByNumberApi(Number(number));
    if (res.success) {
      setOrderData(res.orders[0]);
    }
  };

  useEffect(() => {
    // если заказ не был найден в массиве заказов, то запрошу его отдельно с сервера
    if (!orderData) {
      fetchOrder();
    }
  }, []);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  return isInModal ? (
    <Modal onClose={onClick} title={number}>
      {orderInfo ? (
        <OrderInfoUI orderInfo={orderInfo} isInModal={isInModal} />
      ) : (
        <Preloader />
      )}
    </Modal>
  ) : orderInfo ? (
    <OrderInfoUI orderInfo={orderInfo} isInModal={isInModal} />
  ) : (
    <Preloader />
  );
};
