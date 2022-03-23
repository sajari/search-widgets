describe('Search Takeover Input', async () => {
  it('Should redirect after running a search', () => {
    cy.visit('/');
    cy.get('#toolbar button').click();
    cy.get('[role="listbox"] [role="option"]:nth-child(2)').click();

    cy.waitUntil(() => cy.get('form input').should('be.visible')).then(() => {
      cy.get('form input').first().type('shirt', { force: true });
      cy.get('form').first().submit();
      cy.url().should('include', '/search?q=shirt');
    });
  });
});
