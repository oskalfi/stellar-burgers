import { getFeedsApi } from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';

export const fetchAllOrders = createAsyncThunk(
  'allOrders/fetchAll',
  async () => {
    const allOrders = await getFeedsApi();
    return allOrders;
  }
);

const initialState: TOrdersData & { loading: boolean } = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false
};

export const allOrdersSlice = createSlice({
  name: 'allOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllOrders.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllOrders.fulfilled, (state, action) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.loading = false;
    });
    builder.addCase(fetchAllOrders.rejected, (state, action) => {
      state.loading = false;
      console.error(action.payload);
    });
  },
  selectors: {
    getIsLoading: (state) => state.loading,
    getOrdersData: (state) => state.orders,
    getTotal: (state) => state.total,
    getTotalToday: (state) => state.totalToday
  }
});

export const { getOrdersData, getTotal, getTotalToday, getIsLoading } =
  allOrdersSlice.selectors;

export const getFeed = createSelector(
  [getTotal, getTotalToday],
  (total, totalToday) => ({ total, totalToday })
);
