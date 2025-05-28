const openModalButton = '[data-cy="open-modal"]';
const modal = '[data-cy="modal"]';
const closeButton = '[data-cy="close-button"]';
const modalOverlay = '[data-cy="modal-overlay"]';

// открытие модалки кликом на ингредиент
Cypress.Commands.add('openModalByIngredient', () => {
  cy.get(openModalButton).first().click();
  cy.get(modal).should('be.visible');
});

// закрытие модалки кликом на крестик
Cypress.Commands.add('closeModalByButton', () => {
  cy.get(closeButton).click();
  cy.get(modal).should('not.exist');
});

// закрытие модалки кликом на оверлей
Cypress.Commands.add('closeModalByOverlay', () => {
  cy.get(modalOverlay).click('topLeft', { force: true });
  cy.get(modal).should('not.exist');
});

// команда сборки бургера
Cypress.Commands.add('constructBurger', () => {
  cy.get(
    '[data-cy="add-ingredient-bun-643d69a5c3f7b9001cfa093c"] button'
  ).click();
  cy.get(
    '[data-cy="add-ingredient-sauce-643d69a5c3f7b9001cfa0945"] button'
  ).click();
  cy.get(
    '[data-cy="add-ingredient-main-643d69a5c3f7b9001cfa0947"] button'
  ).click();
});

Cypress.Commands.add('openModalByOrderButton', () => {
  // нажимаю по кнопке «оформить заказ»
  cy.get('[data-cy="order-button"]').click();
  // дожидаемся перехваченного запроса
  cy.wait('@createOrder');
  // проверил, что открылась модалка
  cy.get(modal).should('be.visible');
});
