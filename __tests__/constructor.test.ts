import { userOrdersSlice } from '../src/services/slices/userOrdersSlice';
import { TConstructorIngredient } from '../src/utils/types';

const reducer = userOrdersSlice.reducer;
const {
  setIngredient,
  deleteIngredient,
  moveIngredientUp,
  moveIngredientDown
} = userOrdersSlice.actions;

describe('проверка конструктора (userOrdersSlice)', () => {
  const initialState = {
    constructorItems: {
      bun: null,
      ingredients: []
    },
    orderModalData: null,
    orderRequest: false,
    userOrdersHistory: []
  };

  const mockedIngredient1: TConstructorIngredient = {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    id: 'uuid-123'
  };

  const mockedIngredient2: TConstructorIngredient = {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
    id: 'uuid-456'
  };

  it('должен добавлять ингредиент', () => {
    const nextState = reducer(initialState, setIngredient(mockedIngredient1));

    expect(nextState.constructorItems.ingredients).toContainEqual(
      mockedIngredient1
    );
  });

  it('должен удалять ингредиент по id', () => {
    const state = {
      ...initialState,
      constructorItems: {
        ...initialState.constructorItems,
        ingredients: [mockedIngredient1]
      }
    };

    const nextState = reducer(state, deleteIngredient(mockedIngredient1.id));

    expect(nextState.constructorItems.ingredients).toHaveLength(0);
  });

  it('должен менять порядок ингредиентов: вверх', () => {
    const state = {
      ...initialState,
      constructorItems: {
        ...initialState.constructorItems,
        ingredients: [mockedIngredient1, mockedIngredient2]
      }
    };

    const nextState = reducer(state, moveIngredientUp('uuid-456'));

    expect(nextState.constructorItems.ingredients).toEqual([
      mockedIngredient2,
      mockedIngredient1
    ]);
  });

  it('должен менять порядок ингредиентов: вниз', () => {
    const state = {
      ...initialState,
      constructorItems: {
        ...initialState.constructorItems,
        ingredients: [mockedIngredient1, mockedIngredient2]
      }
    };

    const nextState = reducer(state, moveIngredientDown('uuid-123'));

    expect(nextState.constructorItems.ingredients).toEqual([
      mockedIngredient2,
      mockedIngredient1
    ]);
  });
});
