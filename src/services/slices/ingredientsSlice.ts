import { getIngredientsApi } from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

// type TIngredient<T> = {
//   _id: string;
//   name: string;
//   type: T;
//   proteins: number;
//   fat: number;
//   carbohydrates: number;
//   calories: number;
//   price: number;
//   image: string;
//   image_mobile: string;
//   image_large: string;
//   __v: number;
// };

type TIngredientsState = {
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  loading: boolean;
};

const initialState: TIngredientsState = {
  buns: [],
  mains: [],
  sauces: [],
  loading: false
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);

export const ingredientsSlice = createSlice({
  name: 'allIngredients',
  initialState,
  reducers: {
    setIngredients: (state, action) => {
      state.buns = action.payload.buns;
      state.mains = action.payload.mains;
      state.sauces = action.payload.sauces;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchIngredients.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchIngredients.fulfilled, (state, action) => {
      const buns = action.payload.filter((item) => item.type === 'bun');
      const mains = action.payload.filter((item) => item.type === 'main');
      const sauces = action.payload.filter((item) => item.type === 'sauce');

      state.buns = buns;
      state.mains = mains;
      state.sauces = sauces;
      state.loading = false;
    });
    builder.addCase(fetchIngredients.rejected, (state, action) => {
      state.loading = false;
      console.error(action.payload);
    });
  },
  selectors: {
    getBuns: (state) => state.buns,
    getMains: (state) => state.mains,
    getSauces: (state) => state.sauces,
    getLoader: (state) => state.loading
  }
});

export const { getBuns, getMains, getSauces, getLoader } =
  ingredientsSlice.selectors;
export const getAllIngredients = createSelector(
  [getBuns, getMains, getSauces],
  (buns, mains, sauces) => [...buns, ...mains, ...sauces]
);
export const ingredientsReducer = ingredientsSlice.reducer;
