import {
  userAuthSlice,
  registerAttempt,
  checkUserAuth,
  tryLoginUser,
  updateUserData
} from '../src/services/slices/userAuthSlice';

const reducer = userAuthSlice.reducer;

describe('userAuthSlice', () => {
  const initialState = {
    email: '',
    name: '',
    isAuth: false,
    authChecked: false,
    errorText: '',
    successUpdateText: ''
  };

  it('registerAttempte.fulfilled записывает пользователя и isAuth', () => {
    const action = {
      type: registerAttempt.fulfilled.type,
      payload: {
        user: { email: 'stadnikov.adam@gmail.com', name: 'Адам' }
      }
    };
    const state = reducer(initialState, action);
    expect(state.email).toBe('stadnikov.adam@gmail.com');
    expect(state.name).toBe('Адам');
    expect(state.isAuth).toBe(true);
  });

  it('registerAttempt.rejected записывает ошибку в errorText', () => {
    const action = {
      type: registerAttempt.rejected.type,
      payload: 'Регистрация не удалась'
    };
    const state = reducer(initialState, action);
    expect(state.errorText).toBe(
      'Регистрация не удалась. Возможно, аккаунт с таким адресом уже используется'
    );
  });

  it('checkUserAuth.fulfilled сохраняет данные пользователя в стора, authChecked и isAuth = true', () => {
    const action = {
      type: checkUserAuth.fulfilled.type,
      payload: {
        user: { email: 'stadnikov.adam@gmail.com', name: 'Адам' }
      }
    };
    const state = reducer(initialState, action);
    expect(state.email).toBe('stadnikov.adam@gmail.com');
    expect(state.name).toBe('Адам');
    expect(state.isAuth).toBe(true);
    expect(state.authChecked).toBe(true);
  });

  it('checkUserAuth.rejected ставит isAuth на false, а authChecked на true', () => {
    const action = {
      type: checkUserAuth.rejected.type
    };
    const state = reducer({ ...initialState, isAuth: true }, action);
    expect(state.isAuth).toBe(false);
    expect(state.authChecked).toBe(true);
  });

  it('tryLoginUser.fulfilled сохраняет email и имя пользоваться. isAuth переводится в true', () => {
    const action = {
      type: tryLoginUser.fulfilled.type,
      payload: {
        user: { email: 'stadnikov.adam@gmail.com', name: 'Адам' }
      }
    };
    const state = reducer(initialState, action);
    expect(state.email).toBe('stadnikov.adam@gmail.com');
    expect(state.name).toBe('Адам');
    expect(state.isAuth).toBe(true);
  });

  it('tryLoginUser.rejected сохраняет текст ошибки в поле errorText', () => {
    const action = {
      type: tryLoginUser.rejected.type
    };
    const state = reducer(initialState, action);
    expect(state.errorText).toBe('Неверный пароль или адрес электронной почты');
  });

  it('updateUserData.fulfilled обновляет данные и сохраняет successText', () => {
    const action = {
      type: updateUserData.fulfilled.type,
      payload: {
        user: { email: 'stadnikov.adam@gmail.com', name: 'Adam' }
      }
    };
    const state = reducer(initialState, action);
    expect(state.email).toBe('stadnikov.adam@gmail.com');
    expect(state.name).toBe('Adam');
    expect(state.successUpdateText).toBe('Данные успешно обновлены');
  });

  it('updateUserData.rejected записывает текст ошибки', () => {
    const action = {
      type: updateUserData.rejected.type,
      error: { message: 'Ошибка при обновлении' }
    };
    const state = reducer(initialState, action);
    expect(state.errorText).toBe('Ошибка при обновлении');
  });
});
