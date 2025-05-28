describe('Отображение всего списка ингредиентов', () => {
  it('Все поданные ингредиенты отображаются', () => {
    // Загрузка моковых данных из fixtures чтобы ими разрешить GET-запрос
    cy.fixture('ingredients').then((mockIngredients) => {
      // Перехватываем GET-запрос
      cy.intercept('GET', 'api/ingredients', {
        statusCode: 200,
        body: mockIngredients
      }).as('getIngredients');

      // Переходим на страницу, где делается запрос
      cy.visit('/');

      // Ждём, пока произойдёт запрос
      cy.wait('@getIngredients');

      // Проверяем, что данные действительно отобразились
      cy.get('[data-cy="ingredient-card"]').should(
        'have.length',
        mockIngredients.data.length
      );
    });
  });
});
