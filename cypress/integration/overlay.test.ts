describe('Search Overlay', async () => {
  it('Should open modal and run search successfully', () => {
    cy.visit('/');
    cy.get('#toolbar button').click();
    cy.get('[role="listbox"] [role="option"]:last-child').click();

    cy.waitUntil(
      () =>
        cy
          .get('#button')
          .as('open-modal-button')
          .then(($el) => Cypress.dom.isAttached($el)),
      { timeout: 1000, interval: 10 },
    )
      .get('@open-modal-button')
      .click();

    cy.waitUntil(
      () =>
        cy
          .get('[type="search"]')
          .as('search-input')
          .then(($el) => Cypress.dom.isAttached($el)),
      { timeout: 1000, interval: 10 },
    )
      .get('@search-input')
      .type('shirt');

    cy.get('[data-testid="options-bar"] strong').should('have.text', 'shirt');
    cy.get('button[aria-label="Close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('Should use the value from "inputSelector" element to search', () => {
    cy.visit('/');
    cy.get('#toolbar button').click();
    cy.get('[role="listbox"] [role="option"]:last-child').click();

    cy.get('#search-input').type('jacket');
    cy.get('#button').click();
    cy.get('[type="search"]').should('have.value', 'jacket');
  });
});
