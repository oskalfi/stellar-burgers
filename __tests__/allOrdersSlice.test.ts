import {
  allOrdersSlice,
  fetchAllOrders
} from '../src/services/slices/allOrdersSlice';
import { TOrder } from '../src/utils/types';

const reducer = allOrdersSlice.reducer;

describe('allOrdersSlice', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: null
  };

  it('При запросе заказов loading устанавливается в true (pending)', () => {
    const action = { type: fetchAllOrders.pending.type };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(true);
  });

  it('Если заказы успешно получены, они сохраняются в стор, а loading=false (fulfilled)', () => {
    const mockOrders: TOrder[] = [
      {
        _id: 'order1',
        status: 'done',
        name: 'Тестовый заказ',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
        number: 123,
        ingredients: ['ingredient1', 'ingredient2']
      }
    ];

    const action = {
      type: fetchAllOrders.fulfilled.type,
      payload: {
        orders: mockOrders,
        total: 123,
        totalToday: 12
      }
    };

    const state = reducer({ ...initialState, loading: true }, action);

    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.total).toBe(123);
    expect(state.totalToday).toBe(12);
  });

  it('Если запрос упал, ошибку записывается в стор и loading=false (rejected)', () => {
    const action = {
      type: fetchAllOrders.rejected.type,
      error: { message: 'Ошибка получения заказов' }
    };
    const state = reducer({ ...initialState, loading: true }, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка получения заказов');
  });
});
