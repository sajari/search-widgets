import { Swatch } from '@sajari/react-components';

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

const { colorKeys } = Swatch;

describe('Multiple filters', async () => {
  beforeEach(() => {
    cy.viewport(2560, 1440);
  });

  it('Should trigger the correct API and render the correct UI for other filters', () => {
    cy.intercept('POST', '**/Search').as('search');
    cy.fixture('multiple-filters').then((template) => {
      window.localStorage.setItem('code-content-search-results', JSON.stringify(template));
    });
    cy.visit('/');

    cy.wait('@search');
    cy.get('#list-vendor').within(() => {
      cy.get('div[name^=checkbox]')
        .first()
        .within(() => {
          cy.get('label').click().invoke('text').as('vendorFilter');
        });
    });

    cy.wait('@search').then(({ request, response }) => {
      cy.get('@vendorFilter')
        .then((vendorFilter) => {
          expect(JSON.parse(request.body))
            .property('request')
            .property('values')
            .property('countFilters')
            .to.contain('vendor')
            .to.contain(vendorFilter);
          expect(response)
            .property('body')
            .property('searchResponse')
            .property('aggregateFilters')
            .to.not.be.oneOf([null, undefined]);
          return response?.body.searchResponse.aggregateFilters;
        })
        .as('aggregateFilters');
    });

    cy.get('@aggregateFilters').then((aggregateFilters: any) => {
      const typeFilter = aggregateFilters['count.product_type'].count.counts;
      const typeLabels = Object.keys(typeFilter).sort((a, b) => Number(typeFilter[b]) - Number(typeFilter[a]));
      cy.get('#list-type').within(() => {
        cy.get('div[name^=checkbox]:first').within(() => {
          cy.get('label').invoke('text').should('eq', typeLabels[0]);
          cy.get('span:last').invoke('text').should('eq', String(typeFilter[typeLabels[0]]));
        });
      });

      const colorFilter = aggregateFilters['count.option_color'].count.counts;
      const colorLabel = Object.keys(colorFilter).filter((c) =>
        colorKeys.some((o) => c.toLowerCase() === o.toLowerCase()),
      );
      cy.get('#list-type')
        .parent()
        .next()
        .within(() => {
          cy.get('label').should('have.length', colorLabel.length);
          cy.get('label').each(($el, index) => {
            expect($el).contain(colorLabel[index]);
          });
        });
    });
  });
});
