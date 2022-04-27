describe('Sort', async () => {
  beforeEach(() => {
    cy.viewport(1440, 720);
  });

  it('Should trigger the correct API and render the correct order of items', () => {
    cy.intercept('POST', '**/Search').as('search');
    cy.visit('/');
    cy.wait('@search');

    cy.get('[data-testid="sorting"]')
      .click()
      .within(() => {
        cy.get('li:nth-child(2)').click();
      });
    cy.url().should('include', 'sort=max_price');
    cy.wait('@search').then(({ request }) => {
      expect(JSON.parse(request.body)).property('request').property('values').property('sort').to.eq('max_price');
    });
  });
});

describe('Results per page', async () => {
  beforeEach(() => {
    cy.viewport(1440, 720);
  });

  it('Should trigger the correct API and render the correct number of items', () => {
    cy.intercept('POST', '**/Search').as('search');
    cy.visit('/');
    cy.wait('@search');

    cy.get('[data-testid="results-per-page"]')
      .click()
      .within(() => {
        cy.get('li:nth-child(2)').click();
      });
    cy.url().should('include', 'show=25');
    cy.wait('@search').then(({ request }) => {
      expect(JSON.parse(request.body)).property('request').property('values').property('resultsPerPage').to.eq('25');
      cy.get('[data-testid="result-item"]').should('have.length', 25);
    });
  });
});
