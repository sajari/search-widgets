const defaultFilterConfigs = {
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
};

const visitSearchResult = (configs = defaultFilterConfigs) => {
  localStorage.setItem('code-content-search-results', JSON.stringify(configs));
  localStorage.setItem('active-widget', 'search-results');
  cy.visit('/');

  cy.get('#preview').find('[type="search"]').first().should('be.visible');
};

describe('List filter', async () => {
  beforeEach(() => {
    cy.intercept('POST', '**/Search', { fixture: 'list-filter' }).as('search');
    visitSearchResult();
  });

  it('Should call search api with correct count param', () => {
    cy.wait('@search').then(({ request }) => {
      const body = JSON.parse(request.body);
      expect(body.request.values.count).to.equal('vendor');
    });
  });

  it('Should render filters with show more button', () => {
    cy.get('#list-vendor > div > div').should('have.length', 10);
    cy.get('#list-vendor + div button').should('contain', 'Show more');

    const order = [9, 2, 4, 8, 1, 3, 5, 6, 7, 10];
    order.forEach((vendorNumber, index) => {
      cy.get(`#list-vendor > div > div:nth-of-type(${index + 1}) label`).should('contain', `vendor ${vendorNumber}`);
    });
    cy.get('#list-vendor > div > div:nth-of-type(11)').should('not.exist');
  });

  it('Should show more when click show more button', () => {
    cy.get('#list-vendor + div button').should('contain', 'Show more').click();
    cy.get('#list-vendor + div button').should('contain', 'Show less');
    cy.get('#list-vendor > div > div').should('have.length', 11);
  });

  it('Should check and uncheck filter and call api with correct param', () => {
    cy.intercept('POST', '**/Search').as('search-vendor-9');

    cy.get('#list-vendor > div > div:nth-of-type(1) label').click();
    cy.get('#list-vendor > div > div:nth-of-type(1) input').should('be.checked');
    cy.url().should('include', '?vendor=vendor+9');

    cy.wait('@search-vendor-9').then(({ request }) => {
      const body = JSON.parse(request.body);
      expect(body.request.values.countFilters).to.equal('vendor = "vendor 9"');
    });

    cy.intercept('POST', '**/Search').as('search');

    cy.get('#list-vendor > div > div:nth-of-type(1) label').click();
    cy.get('#list-vendor > div > div:nth-of-type(1) input').should('not.be.checked');
    cy.url().should('not.include', '?vendor=vendor+9');

    cy.wait('@search-vendor-9').then(({ request }) => {
      const body = JSON.parse(request.body);
      expect(body.request.values.countFilters).to.equal('');
    });
  });

  it('Should reset when reset button is clicked', () => {
    cy.intercept('POST', '**/Search').as('search-vendor-9');

    cy.get('#list-vendor > div > div:nth-of-type(1) label').click();
    cy.get('#list-vendor > div > div:nth-of-type(1) input').should('be.checked');
    cy.url().should('include', '?vendor=vendor+9');

    cy.get('#filter-vendor-label + button').should('contain', 'Reset').click();
    cy.get('#list-vendor > div > div:nth-of-type(1) input').should('not.be.checked');
    cy.url().should('not.include', '?vendor=vendor+9');
  });
});
