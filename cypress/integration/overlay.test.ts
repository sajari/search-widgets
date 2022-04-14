describe('Search Overlay', async () => {
  it('Should open modal and run search successfully', () => {
    cy.visit('/');
    cy.get('#toolbar button').click();
    cy.get('[role="listbox"] [role="option"]:last-child').click();

    cy.get('#preview')
      .find('#button')
      .should('be.visible')
      .then((e) => Cypress.$(e).trigger('click'));

    cy.get('body').find('[type="search"]').should('be.visible').type('shirt');

    cy.get('[data-testid="options-bar"] strong').should('have.text', 'shirt');
    cy.get('button[aria-label="Close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('Should use the value from "inputSelector" element to search', () => {
    cy.visit('/');
    cy.get('#toolbar button').click();
    cy.get('[role="listbox"] [role="option"]:last-child').click();

    cy.get('#preview').find('#search-input').type('jacket');
    cy.get('#button').click();
    cy.get('[type="search"]').should('have.value', 'jacket');
  });
});
