import { getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';
import { TOrder } from '@utils-types';

type TUserOrdersState = {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderModalData: TOrder | null;
  orderRequest: boolean;
  userOrdersHistory: TOrder[];
};

const initialState: TUserOrdersState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderModalData: null,
  orderRequest: false,
  userOrdersHistory: []
};

export const fetchUserOrdersHistory = createAsyncThunk(
  'userOrders/getHistory',
  async () => {
    const res = await getOrdersApi();
    return res;
  }
);

export const fetchNewOrder = createAsyncThunk(
  'userOrders/orderBurger',
  async (ingredients: string[]) => {
    const res = await orderBurgerApi(ingredients);
    return res;
  }
);

export const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {
    setBun: (state, action) => {
      state.constructorItems.bun = action.payload;
    },
    setIngredient: (state, action) => {
      state.constructorItems.ingredients.push(action.payload);
    },
    moveIngredientUp: (state, action) => {
      const index = state.constructorItems.ingredients.findIndex(
        (item) => item.id === action.payload
      );
      if (index > 0) {
        const temp = state.constructorItems.ingredients[index];
        state.constructorItems.ingredients[index] =
          state.constructorItems.ingredients[index - 1];
        state.constructorItems.ingredients[index - 1] = temp;
      }
    },
    moveIngredientDown: (state, action) => {
      const index = state.constructorItems.ingredients.findIndex(
        (item) => item.id === action.payload
      );
      if (index < state.constructorItems.ingredients.length - 1) {
        const temp = state.constructorItems.ingredients[index];
        state.constructorItems.ingredients[index] =
          state.constructorItems.ingredients[index + 1];
        state.constructorItems.ingredients[index + 1] = temp;
      }
    },
    deleteIngredient: (state, action) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
    },
    setRequested: (state, action) => {
      state.orderRequest = action.payload;
    },
    setOrderModalNull: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNewOrder.pending, (state) => {
      state.orderRequest = true;
    });
    builder.addCase(fetchNewOrder.fulfilled, (state, action) => {
      state.orderRequest = false;
      state.orderModalData = action.payload.order;
      state.orderModalData.name = action.payload.name;
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    });
    builder.addCase(fetchNewOrder.rejected, (state, action) => {
      state.orderRequest = false;
      console.error(action.error);
    });
    builder.addCase(fetchUserOrdersHistory.pending, (state) => {});
    builder.addCase(fetchUserOrdersHistory.fulfilled, (state, action) => {
      state.userOrdersHistory = action.payload;
    });
    builder.addCase(fetchUserOrdersHistory.rejected, (state, action) => {
      console.error(action.error.message);
    });
  },
  selectors: {
    getConstructorItems: (state) => state.constructorItems,
    getOrderModalData: (state) => state.orderModalData,
    getOrderRequest: (state) => state.orderRequest,
    getUserOrdersHistory: (state) => state.userOrdersHistory
  }
});

export const userOrdersReducer = userOrdersSlice.reducer;
export const {
  getConstructorItems,
  getOrderModalData,
  getOrderRequest,
  getUserOrdersHistory
} = userOrdersSlice.selectors;
export const {
  setBun,
  setIngredient,
  moveIngredientDown,
  moveIngredientUp,
  deleteIngredient,
  setRequested,
  setOrderModalNull
} = userOrdersSlice.actions;
