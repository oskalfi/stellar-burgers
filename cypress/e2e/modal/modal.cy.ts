describe('Модальное окно', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Открывается по кнопке', () => {
    cy.openModalByIngredient();
  });

  it('Закрывается по кнопке крестик', () => {
    cy.openModalByIngredient();
    cy.closeModalByButton();
  });

  it('Закрывается по клику на оверлей', () => {
    cy.openModalByIngredient();
    cy.closeModalByOverlay();
  });
});
