describe('Отображение всего списка ингредиентов', () => {
  it('Проверка отрисовки замоканного списка ингредиентов', () => {
    // Загружаем моковые данные из fixtures
    cy.fixture('ingredients').then((mockIngredients) => {
      // Перехватываем GET-запрос
      cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
        statusCode: 200,
        body: mockIngredients
      }).as('getIngredients');

      // Переходим на страницу, где делается запрос
      cy.visit('/');

      // Ждём, пока произойдёт запрос
      cy.wait('@getIngredients');

      // Проверяем, что данные действительно отобразились
      cy.fixture('ingredients').then((mockIngredients) => {
        cy.get('[data-cy="ingredient-card"]').should(
          'have.length',
          mockIngredients.data.length
        );
      });
    });
  });
});
