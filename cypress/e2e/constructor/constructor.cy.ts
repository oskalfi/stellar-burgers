type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

type TConstructorIngredient = TIngredient & {
  id: string;
};

describe('Добавление ингредиентов по типу', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Добавляет булку, соус и основу в правильные части Redux store', () => {
    // Клик по ингредиенту с типом bun
    cy.get(
      '[data-cy="add-ingredient-bun-643d69a5c3f7b9001cfa093c"] button'
    ).click();

    // Клик по ингредиенту с типом sauce
    cy.get(
      '[data-cy="add-ingredient-sauce-643d69a5c3f7b9001cfa0945"] button'
    ).click();

    // Клик по ингредиенту с типом main
    cy.get(
      '[data-cy="add-ingredient-main-643d69a5c3f7b9001cfa0947"] button'
    ).click();

    // проверка что выбранные ингредиенты отображаются в конструкторе
    cy.get('[data-cy="bun-ingredient"]').eq(0).should('be.visible');
    cy.get('[data-cy="bun-ingredient"]').eq(1).should('be.visible');
    cy.get('[data-cy="main-ingredient"]').eq(0).should('be.visible');
    cy.get('[data-cy="main-ingredient"]').eq(1).should('be.visible');

    // Проверка store
    cy.window()
      .its('__REDUX_STORE__')
      .invoke('getState')
      .then((state) => {
        const constructor = state.userOrders.constructorItems;

        // Проверка булки
        expect(constructor.bun).to.include({ _id: '643d69a5c3f7b9001cfa093c' });

        // Проверка, что есть соус
        expect(
          constructor.ingredients.some(
            (item: TConstructorIngredient) =>
              item._id === '643d69a5c3f7b9001cfa0945'
          )
        ).to.be.true;

        // Проверка, что есть основа
        expect(
          constructor.ingredients.some(
            (item: TConstructorIngredient) =>
              item._id === '643d69a5c3f7b9001cfa0947'
          )
        ).to.be.true;
      });
  });
});
