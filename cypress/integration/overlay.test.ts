describe('Search Overlap', async () => {
  // TODO: need to check why the following test failed in CI
  // it('Should open modal and run search successfully', () => {
  //   cy.visit('/');
  //   cy.get('#toolbar button').click();
  //   cy.get('[role="listbox"] [role="option"]:last-child').click();

  //   cy.get('#button').click();

  //   cy.waitUntil(() => cy.get('[type="search"]')).then(() => {
  //     cy.get('[type="search"]').type('shirt');
  //     cy.get('[data-testid="options-bar"] strong').should('have.text', 'shirt');
  //     cy.get('button[aria-label="Close"]').click();
  //     cy.get('[data-testid="modal"]').should('not.exist');
  //   });
  // });

  it('Should use the value from "inputSelector" element to search', () => {
    cy.visit('/');
    cy.get('#toolbar button').click();
    cy.get('[role="listbox"] [role="option"]:last-child').click();

    cy.get('#search-input').type('jacket');
    cy.get('#button').click();
    cy.get('[type="search"]').should('have.value', 'jacket');
  });
});
