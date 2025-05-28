/// <reference types="cypress" />
declare namespace Cypress {
  interface Chainable {
    openModalByIngredient(): Chainable<void>;
    closeModalByButton(): Chainable<void>;
    closeModalByOverlay(): Chainable<void>;
    constructBurger(): Chainable<void>;
    openModalByOrderButton(): Chainable<void>;
  }
}
