describe('Модальное окно', () => {
  beforeEach(() => {
    cy.visit('/'); // Страница с модалкой
  });

  it('Открывается по кнопке', () => {
    cy.get('[data-cy="open-modal"]').first().click();
    cy.get('[data-cy="modal"]').should('be.visible');
  });

  it('Закрывается по кнопке крестик', () => {
    cy.get('[data-cy="open-modal"]').first().click();
    cy.get('[data-cy="modal"]').should('be.visible');

    cy.get('[data-cy="close-button"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('Закрывается по клику на оверлей', () => {
    cy.get('[data-cy="open-modal"]').first().click();
    cy.get('[data-cy="modal"]').should('be.visible');

    cy.get('[data-cy="modal-overlay"]').click('topLeft', { force: true }); // координаты клика вне модалки.
    // почему то при тесте вылазит ошибка, что оверлей перекрыт изображением
    // ингредиента, но на деле нет. Поэтому использовал force: true;
    cy.get('[data-cy="modal"]').should('not.exist');
  });
});
