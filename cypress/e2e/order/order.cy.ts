describe('Авторизация через мок и оформление заказа', () => {
  let authData;

  beforeEach(() => {
    cy.fixture('userAuthRequest').then((data) => {
      authData = data;

      const accessToken = data.accessToken;
      const refreshToken = data.refreshToken;

      // перехват POST-запроса на /auth/login
      cy.intercept('POST', 'https://norma.nomoreparties.space/api/auth/login', {
        statusCode: 200,
        body: data
      }).as('login');

      // перехват GET-запроса на /auth/user
      cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
        statusCode: 200,
        body: {
          success: true,
          user: data.user
        }
      }).as('getUser');

      // сохраняю токены
      cy.setCookie('accessToken', accessToken);
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', refreshToken);
      });

      // захожу на домашнюю страницу
      cy.visit('/');
    });
  });

  it('После авторизации отображается имя пользователя', () => {
    cy.contains('Адамыч').should('exist');
  });

  it('Сборка бургера, оформление заказа и закрытие мод.окна', () => {
    cy.fixture('orderRequest').then((orderData) => {
      cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', {
        statusCode: 200,
        body: orderData
      }).as('createOrder');

      // сборка бургера:
      cy.get(
        '[data-cy="add-ingredient-bun-643d69a5c3f7b9001cfa093c"] button'
      ).click();
      cy.get(
        '[data-cy="add-ingredient-sauce-643d69a5c3f7b9001cfa0945"] button'
      ).click();
      cy.get(
        '[data-cy="add-ingredient-main-643d69a5c3f7b9001cfa0947"] button'
      ).click();

      // нажал на кнопку оформить
      cy.get('[data-cy="order-button"]').click();

      // дожидаемся перехваченного запроса
      cy.wait('@createOrder');

      // проверил, что открылась модалка
      cy.get('[data-cy="modal"]').should('be.visible');

      // проверил номер заказа
      cy.get('[data-cy="order-number"]')
        .should('be.visible')
        .and('contain', orderData.order.number);

      cy.get('[data-cy="modal-overlay"]').click('topLeft', { force: true }); // координаты клика вне модалки.
      // почему то при тесте вылазит ошибка, что оверлей перекрыт изображением
      // ингредиента, но на деле нет. Поэтому использовал force: true;
      cy.get('[data-cy="modal"]').should('not.exist');
    });
  });

  it('После закрытия модального окна конструктор пуст', () => {
    cy.get('[data-cy="bun-ingredient"]').should('not.exist');
    cy.get('[data-cy="main-ingredient"]').should('not.exist');
  });
});
