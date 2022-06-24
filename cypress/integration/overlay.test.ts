const defaultOverlayConfigs = {
  account: '1603163345448404241',
  collection: 'sajari-test-fashion2',
  pipeline: 'query',
  preset: 'shopify',
  filters: [
    {
      name: 'vendor',
      field: 'vendor',
      title: 'Vendor',
      searchable: true,
    },
  ],
  options: {
    mode: 'overlay',
    buttonSelector: '#button',
    inputSelector: '#search-input',
  },
};

const visitSearchOverlay = (configs = defaultOverlayConfigs) => {
  localStorage.setItem('code-content-search-input', JSON.stringify(configs));
  localStorage.setItem('active-widget', 'overlay');
  cy.visit('/');
};

describe('Search Overlay', () => {
  beforeEach(() => {
    visitSearchOverlay();
    cy.intercept('POST', '**/Search', { fixture: 'search-overlay' }).as('search');
  });

  it('Should open modal and run search successfully', () => {
    cy.get('#preview').find('#button').should('be.visible').click();
    cy.get('[data-testid="modal"]').find('[type="search"]').should('be.visible').type('shirt');
    cy.get('[data-testid="options-bar"] strong').should('have.text', 'shirt');
    cy.get('button[aria-label="Close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('Should use the value from "inputSelector" element to search', () => {
    cy.get('#preview').find('#search-input').type('jacket');
    cy.get('#button').click();
    cy.get('[type="search"]').should('have.value', 'jacket');
  });

  it('Should redirect to product page on product click', () => {
    cy.get('#preview').find('#search-input').type('shirt');
    cy.get('#button').click();
    cy.get('[data-testid="overlay-results"]').find('a').first().click();
    cy.url().should('include', '/products/ultime-shirt-dress-2');
  });

  it('Should not inject URL param after changing UI state', () => {
    cy.get('#button').click();
    cy.get('[data-testid="modal"]').find('[type="search"]').should('be.visible').type('jacket');
    // Wait a bit for the URL updated due to debouncing effect
    // eslint-disable-next-line
    cy.wait(500);
    cy.url().should('not.include', 'q=jacket');
  });
});
