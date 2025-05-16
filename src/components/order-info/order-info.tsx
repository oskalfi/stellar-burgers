import { FC, useEffect, useMemo, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector } from '../../services/store';
import { getOrdersData } from '../../services/slices/allOrdersSlice';
import { useLocation, useParams } from 'react-router-dom';
import { getAllIngredients } from '../../services/slices/ingredientsSlice';
import { getOrderByNumberApi } from '@api';

export const OrderInfo: FC = () => {
  const { number } = useParams();
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

  // добавлю отступ сверху для заказа, который открыли по прямой ссылке
  const location = useLocation();
  const isInModal = location.state?.background ? true : false;

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

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} isInModal={isInModal} />;
};
