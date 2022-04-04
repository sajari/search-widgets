describe('Search Input', async () => {
  it('Should redirect after running a search', () => {
    cy.visit('/');
    cy.get('#toolbar button').click();
    // eslint-disable-next-line
    cy.get('[role="listbox"] [role="option"]:nth-child(3)').click().wait(3000);

    cy.get('#preview').find('[type="search"]').first().should('be.visible').type('shirt');

    cy.get('form').submit();
    cy.url().should('include', '/search?q=shirt');
  });

  it('Should use the value from q param as the default value for the input', () => {
    cy.visit('/?q=jacket');
    cy.get('#toolbar button').click();
    cy.get('[role="listbox"] [role="option"]:nth-child(3)').click();

    cy.get('input[type="search"]').first().should('have.value', 'jacket');
  });
});
