describe('Search Overlay', async () => {
  it('Should open modal and run search successfully', () => {
    cy.visit('/');
    cy.get('#toolbar button').click();
    cy.get('[role="listbox"] [role="option"]:last-child').click();

    cy.get('#button').click({ force: true });

    // Wait for modal to appear. Without the line, Github CI normally fails
    // to detect the element and is causing the test to fail
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);

    cy.get('[type="search"]').type('shirt');
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
