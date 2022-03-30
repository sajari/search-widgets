describe('Search Input', async () => {
  it('Should redirect after running a search', () => {
    cy.visit('/');
    cy.get('#toolbar button').click();
    cy.get('[role="listbox"] [role="option"]:nth-child(3)').click();

    // Wait for input to appear. Without the line, Github CI normally fails
    // to detect the element and is causing the test to fail
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);

    cy.get('[type="search"]').first().type('shirt', { delay: 1000 });
    cy.get('form').submit();
    cy.url().should('include', '/search?q=shirt');
  });
});
