describe('Search Input', async () => {
  it('Should redirect after running a search', () => {
    cy.visit('/');
    cy.get('#toolbar button').click();
    cy.get('[role="listbox"] [role="option"]:nth-child(3)').click();

    cy.waitUntil(() => cy.get('[type="search"]')).then(() => {
      cy.get('[type="search"]').type('shirt');
      cy.get('form').submit();
      cy.url().should('include', '/search?q=shirt');
    });
  });
});
