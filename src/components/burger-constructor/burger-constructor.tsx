import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchNewOrder,
  getConstructorItems,
  getOrderModalData,
  getOrderRequest,
  setOrderModalNull
} from '../../services/slices/userOrdersSlice';
import { useNavigate } from 'react-router-dom';
import { userIsAuth } from '../../services/slices/userAuthSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(getConstructorItems);

  const orderRequest = useSelector(getOrderRequest);

  const orderModalData = useSelector(getOrderModalData);

  const isAuth = useSelector(userIsAuth);

  const onOrderClick = () => {
    if (isAuth) {
      if (!constructorItems.bun) return;
      if (constructorItems.ingredients.length < 1) return;
      const allIngredientsIds = [
        constructorItems.bun._id,
        ...constructorItems.ingredients.map((ingredient) => ingredient._id)
      ];
      dispatch(fetchNewOrder(allIngredientsIds));
    } else {
      navigate('/login');
    }
  };

  const closeOrderModal = () => {
    dispatch(setOrderModalNull());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
