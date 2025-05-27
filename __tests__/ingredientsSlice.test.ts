import {
  ingredientsSlice,
  fetchIngredients
} from '../src/services/slices/ingredientsSlice';
import { TIngredient } from '../src/utils/types';

const reducer = ingredientsSlice.reducer;

describe('ingredientsSlice', () => {
  const initialState = {
    buns: [],
    mains: [],
    sauces: [],
    loading: false,
    error: null
  };

  it('При диспатче санки (при pending) loading переходит в состояние true', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(true);
  });

  it('При fulfilled в стор записываются ингредиенты и loading переходит в состояние false ', () => {
    const payload: TIngredient[] = [
      {
        _id: '1',
        name: 'Булка',
        type: 'bun',
        proteins: 0,
        fat: 0,
        carbohydrates: 0,
        calories: 0,
        price: 0,
        image: '',
        image_large: '',
        image_mobile: ''
      },
      {
        _id: '2',
        name: 'Котлета',
        type: 'main',
        proteins: 0,
        fat: 0,
        carbohydrates: 0,
        calories: 0,
        price: 0,
        image: '',
        image_large: '',
        image_mobile: ''
      },
      {
        _id: '3',
        name: 'Соус',
        type: 'sauce',
        proteins: 0,
        fat: 0,
        carbohydrates: 0,
        calories: 0,
        price: 0,
        image: '',
        image_large: '',
        image_mobile: ''
      }
    ];

    const action = { type: fetchIngredients.fulfilled.type, payload };
    const state = reducer({ ...initialState, loading: true }, action);

    expect(state.loading).toBe(false);
    expect(state.buns).toEqual([payload[0]]);
    expect(state.mains).toEqual([payload[1]]);
    expect(state.sauces).toEqual([payload[2]]);
  });

  it('При rejected сообщение об ошибке записывается в стор и loading переходит в состояние false ', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка загрузки' }
    };
    const state = reducer({ ...initialState, loading: true }, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
