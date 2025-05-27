import { rootReducer } from '../src/services/store';
import { Action } from '@reduxjs/toolkit';
jest.mock('@api');

describe('rootReducer', () => {
  it('должен возвращать корректное начальное состояние', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' } as Action);

    expect(initialState).toEqual({
      allIngredients: {
        buns: [],
        error: null,
        mains: [],
        sauces: [],
        loading: false
      },
      userOrders: {
        constructorItems: {
          bun: null,
          ingredients: []
        },
        orderModalData: null,
        orderRequest: false,
        userOrdersHistory: []
      },
      allOrders: {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null
      },
      userAuth: {
        email: '',
        name: '',
        isAuth: false,
        authChecked: false,
        errorText: '',
        successUpdateText: ''
      }
    });
  });
});
