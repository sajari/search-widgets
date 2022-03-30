describe('Search Takeover Input', async () => {
  it('Should redirect after running a search', () => {
    cy.visit('/');
    cy.get('#toolbar button').click();
    cy.get('[role="listbox"] [role="option"]:nth-child(2)').click();

    cy.get('form input').first().type('shirt', { force: true, delay: 1000 });
    cy.get('form').first().submit();
    cy.url().should('include', '/search?q=shirt');
  });
});
