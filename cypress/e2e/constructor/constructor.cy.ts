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
  const bunIngredient = '[data-cy="bun-ingredient"]';
  const mainIngredient = '[data-cy="main-ingredient"]';

  beforeEach(() => {
    cy.visit('/');
  });

  it('Добавленные ингредиенты отображаются и добавляются в правильные части Redux store', () => {
    // сборка бургера
    cy.constructBurger();

    // проверка что выбранные ингредиенты отображаются в конструкторе
    cy.get(bunIngredient).eq(0).should('be.visible');
    cy.get(bunIngredient).eq(1).should('be.visible');
    cy.get(mainIngredient).eq(0).should('be.visible');
    cy.get(mainIngredient).eq(1).should('be.visible');

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
