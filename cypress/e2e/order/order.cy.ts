describe('Авторизация через мок и оформление заказа', () => {
  let authData;

  beforeEach(() => {
    cy.fixture('userAuthRequest').then((data) => {
      authData = data;

      const accessToken = data.accessToken;
      const refreshToken = data.refreshToken;

      // перехват POST-запроса на /auth/login
      cy.intercept('POST', 'api/auth/login', {
        statusCode: 200,
        body: data
      }).as('login');

      // перехват GET-запроса на /auth/user
      cy.intercept('GET', 'api/auth/user', {
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
      cy.intercept('POST', 'api/orders', {
        statusCode: 200,
        body: orderData
      }).as('createOrder');

      // сборка бургера:
      cy.constructBurger();
      // нажал на кнопку оформить
      cy.openModalByOrderButton();

      // проверил номер заказа
      cy.get('[data-cy="order-number"]')
        .should('be.visible')
        .and('contain', orderData.order.number);

      // закрыл модалку кликом на оверлей
      cy.closeModalByOverlay();
    });
  });

  it('После закрытия модального окна конструктор пуст', () => {
    cy.get('[data-cy="bun-ingredient"]').should('not.exist');
    cy.get('[data-cy="main-ingredient"]').should('not.exist');
  });
});
