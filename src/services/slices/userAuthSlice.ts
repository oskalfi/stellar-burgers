import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

export const registerAttempt = createAsyncThunk(
  'userAuth/register',
  async (data: TRegisterData, thunkAPI) => {
    try {
      const userData = await registerUserApi(data);
      setCookie('accessToken', userData.accessToken, { expires: 1200 });
      localStorage.setItem('refreshToken', userData.refreshToken);
      return userData;
    } catch (err) {
      return thunkAPI.rejectWithValue('Регистрация не удалась');
    }
  }
);

export const checkUserAuth = createAsyncThunk('userAuth/check', async () => {
  if (getCookie('accessToken')) {
    const res = await getUserApi();
    return res;
  }
  throw new Error('Отсутствует токен');
});

export const tryLoginUser = createAsyncThunk(
  'userAuth/login',
  async (data: TLoginData) => {
    const res = await loginUserApi(data);
    return res;
  }
);

export const updateUserData = createAsyncThunk(
  'userAuth/updateData',
  async (data: Partial<TRegisterData>) => {
    const res = await updateUserApi(data);
    return res;
  }
);

const initialState: TUser & {
  isAuth: boolean;
  errorText: string;
  successUpdateText: string;
  authChecked: boolean;
} = {
  email: '',
  name: '',
  isAuth: false,
  authChecked: false,
  errorText: '',
  successUpdateText: ''
};

export const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    logout: (state) => {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      state.isAuth = false;
      state.name = '';
      state.email = '';
    },
    setErrorText: (state, action) => {
      state.errorText = action.payload;
    },
    clearErrorText: (state) => {
      state.errorText = '';
    },
    clearSuccessText: (state) => {
      state.successUpdateText = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(registerAttempt.pending, (state) => {});
    builder.addCase(registerAttempt.fulfilled, (state, action) => {
      state.email = action.payload.user.email;
      state.name = action.payload.user.name;
      setCookie('accessToken', action.payload.accessToken, { expires: 1200 });
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      state.isAuth = true;
    });
    builder.addCase(registerAttempt.rejected, (state, action) => {
      console.error('ошибка', action.error.message);
    });
    builder.addCase(checkUserAuth.pending, (state) => {});
    builder.addCase(checkUserAuth.fulfilled, (state, action) => {
      state.name = action.payload.user.name;
      state.email = action.payload.user.email;
      state.isAuth = true;
      state.authChecked = true;
    });
    builder.addCase(checkUserAuth.rejected, (state, action) => {
      state.isAuth = false;
      state.authChecked = true;
    });
    builder.addCase(tryLoginUser.pending, (state) => {});
    builder.addCase(tryLoginUser.fulfilled, (state, action) => {
      state.email = action.payload.user.email;
      state.name = action.payload.user.name;
      setCookie('accessToken', action.payload.accessToken, { expires: 1200 });
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      state.isAuth = true;
    });
    builder.addCase(tryLoginUser.rejected, (state, action) => {
      state.errorText = 'Адрес электронной почты или пароль указаны неверно';
    });
    builder.addCase(updateUserData.pending, (state) => {});
    builder.addCase(updateUserData.fulfilled, (state, action) => {
      state.email = action.payload.user.email;
      state.name = action.payload.user.name;
      state.successUpdateText = 'Данные успешно обновлены';
    });
    builder.addCase(updateUserData.rejected, (state, action) => {
      state.errorText = action.error.message || '';
    });
  },
  selectors: {
    userIsAuth: (state) => state.isAuth,
    isAuthChecked: (state) => state.authChecked,
    getUserName: (state) => state.name,
    getUserEmail: (state) => state.email,
    getErrorText: (state) => state.errorText,
    getSuccessText: (state) => state.successUpdateText
  }
});

export const { logout, setErrorText, clearErrorText, clearSuccessText } =
  userAuthSlice.actions;

export const {
  userIsAuth,
  isAuthChecked,
  getUserName,
  getUserEmail,
  getErrorText,
  getSuccessText
} = userAuthSlice.selectors;
