describe('Search Input', async () => {
  it('Should redirect after running a search', () => {
    cy.visit('/');
    cy.get('#toolbar button').click();
    cy.get('[role="listbox"] [role="option"]:nth-child(3)').click();

    cy.waitUntil(
      () =>
        cy
          .get('[type="search"]')
          .first()
          .as('search-input')
          .then(($el) => Cypress.dom.isAttached($el)),
      { timeout: 1000, interval: 10 },
    )
      .get('@search-input')
      .type('shirt');

    cy.get('form').submit();
    cy.url().should('include', '/search?q=shirt');
  });
});
