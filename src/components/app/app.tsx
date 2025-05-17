import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, OrderInfo } from '@components';

import { Routes, Route, useLocation } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { useDispatch, useSelector } from '../../services/store';
import { useEffect } from 'react';
import {
  checkUserAuth,
  isAuthChecked,
  userIsAuth
} from '../../services/slices/userAuthSlice';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const backgroundLocation = location.state?.background;
  const isAuth = useSelector(userIsAuth);
  const authChecked = useSelector(isAuthChecked);

  useEffect(() => {
    dispatch(checkUserAuth());
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='*' element={<NotFound404 />} />
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed'>
          <Route index element={<Feed />} />
          <Route path=':number' element={<OrderInfo />} />
        </Route>
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/profile'>
          <Route
            index
            element={
              <ProtectedRoute isAuth={isAuth} authChecked={authChecked}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='orders'
            element={
              <ProtectedRoute isAuth={isAuth} authChecked={authChecked}>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path='orders/:number'
            element={
              <ProtectedRoute isAuth={isAuth} authChecked={authChecked}>
                <OrderInfo />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route
            path={'/ingredients/:id'}
            element={<IngredientDetails isInModal />}
          />
          <Route path={'/feed/:number'} element={<OrderInfo isInModal />} />
          <Route
            path='/profile/orders/:number'
            element={<OrderInfo isInModal />}
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
