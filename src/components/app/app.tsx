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

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';

import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate
} from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.background;
  const isAuth = useSelector(userIsAuth);
  const authChecked = useSelector(isAuthChecked);

  const onClick = () => {
    if (backgroundLocation?.pathname) {
      navigate(backgroundLocation.pathname, { replace: true });
    } else {
      navigate(-1);
    }
  };

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

        <Route
          path='/login'
          element={
            <ProtectedRoute
              isAuth={isAuth}
              redirectPath='/'
              authChecked={authChecked}
            >
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute
              isAuth={isAuth}
              redirectPath='/profile'
              authChecked={authChecked}
            >
              <Register />
            </ProtectedRoute>
          }
        />

        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute
              isAuth={isAuth}
              redirectPath='/profile'
              authChecked={authChecked}
            >
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute
              isAuth={isAuth}
              redirectPath='/profile'
              authChecked={authChecked}
            >
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route path='/profile'>
          <Route
            index
            element={
              <ProtectedRoute
                isAuth={!isAuth}
                redirectPath='/login'
                authChecked={authChecked}
              >
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='orders'
            element={
              <ProtectedRoute
                isAuth={!isAuth}
                redirectPath='/login'
                authChecked={authChecked}
              >
                <ProfileOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path='orders/:number'
            element={
              <ProtectedRoute
                isAuth={!isAuth}
                redirectPath='/'
                authChecked={authChecked}
              >
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
            element={
              <Modal onClose={onClick} title={'Детали ингредиента'}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path={'/feed/:number'}
            element={
              <Modal onClose={onClick} title={'Детали заказа'}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal onClose={onClick} title={'Детали заказа'}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
