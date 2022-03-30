describe('Search Results', async () => {
  it('Should sync input query with URL bar', () => {
    cy.visit('/');
    cy.get('input[type="search"]').first().type('shirt');
    cy.get('input[type="search"]').first().should('have.value', 'shirt');
    cy.url().should('include', '?q=shirt');
  });

  it('Should search with query params', () => {
    cy.visit('/?q=jacket');
    cy.get('input[type="search"]').first().should('have.value', 'jacket');
  });
});
