import { Swatch } from '@sajari/react-components';

const defaultFilterConfigs = {
  account: '1603163345448404241',
  collection: 'sajari-test-fashion2',
  pipeline: 'query',
  preset: 'shopify',
  filters: [
    {
      name: 'vendor',
      type: '',
      field: 'vendor',
      title: 'Vendor',
      searchable: true,
      array: false,
    },
  ],
};

const visitSearchResult = (configs = defaultFilterConfigs) => {
  localStorage.setItem('code-content-search-results', JSON.stringify(configs));
  localStorage.setItem('active-widget', 'search-results');
  cy.visit('/');

  cy.get('#preview').find('[type="search"]').first().should('be.visible');
};

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

describe('Rating filter', async () => {
  beforeEach(() => {
    cy.intercept('POST', '**/Search', { fixture: 'rating-filter' }).as('search');
    visitSearchResult({
      ...defaultFilterConfigs,
      filters: [
        {
          name: 'rating',
          type: 'rating',
          field: 'rating',
          title: 'Rating',
          searchable: false,
          array: false,
        },
      ],
    });
  });

  it('Should call search api with correct count param', () => {
    cy.wait('@search').then(({ request }) => {
      const body = JSON.parse(request.body);
      expect(body.request.values.count).to.equal('rating');
    });
  });

  it('Should render filters in descending rating order', () => {
    cy.get('#list-rating > div > div').should('have.length', 6);

    new Array(6).fill(null).forEach((_, index) => {
      cy.get(`#list-rating > div > div:nth-of-type(${index + 1}) [role="img"]`)
        .invoke('attr', 'aria-label')
        .should('equal', `Rating: ${5 - index} out of 5 stars`);
    });
  });

  it('Should check and uncheck filter and call api with correct param', () => {
    cy.intercept('POST', '**/Search', { fixture: 'rating-filter' }).as('search-rating-5');

    cy.get('#list-rating > div > div:nth-of-type(1) input[type="checkbox"]').click();
    cy.get('#list-rating > div > div:nth-of-type(1) input[type="checkbox"]').should('be.checked');
    cy.url().should('include', '?rating=5');

    cy.wait('@search-rating-5').then(({ request }) => {
      const body = JSON.parse(request.body);
      expect(body.request.values.countFilters).to.equal('rating = "5"');
    });

    cy.get('#list-rating > div > div:nth-of-type(1) input[type="checkbox"]').click();
    cy.get('#list-rating > div > div:nth-of-type(1) input[type="checkbox"]').should('not.be.checked');
    cy.url().should('not.include', '?rating=5');

    cy.wait('@search-rating-5').then(({ request }) => {
      const body = JSON.parse(request.body);
      expect(body.request.values.countFilters).to.equal('');
    });
  });

  it('Should reset when reset button is clicked', () => {
    cy.get('#list-rating > div > div:nth-of-type(1) input[type="checkbox"]').click();
    cy.get('#list-rating > div > div:nth-of-type(1) input[type="checkbox"]').should('be.checked');
    cy.url().should('include', '?rating=5');

    cy.get('#filter-rating-label + button').should('contain', 'Reset').click();
    cy.get('#list-rating > div > div:nth-of-type(1) input[type="checkbox"]').should('not.be.checked');
    cy.url().should('not.include', '?rating=5');
  });
});

describe.only('Color filter', async () => {
  beforeEach(() => {
    cy.intercept('POST', '**/Search', { fixture: 'color-filter' }).as('search');
    visitSearchResult({
      ...defaultFilterConfigs,
      filters: [
        {
          name: 'color',
          type: 'color',
          field: 'option_color',
          title: 'Color',
          searchable: false,
          array: true,
        },
      ],
    });
  });

  it('Should call search api with correct count param', () => {
    cy.wait('@search').then(({ request }) => {
      const body = JSON.parse(request.body);
      expect(body.request.values.count).to.equal('option_color');
    });
  });

  it('Should render 5 filter options', () => {
    cy.get('[data-testid="option_color-filter"] label').should('have.length', 5);
  });

  it('Should check and uncheck filter and call api with correct param', () => {
    cy.intercept('POST', '**/Search', { fixture: 'color-filter' }).as('search-black');

    cy.get('[data-testid="option_color-filter"] label').first().click();
    cy.get('[data-testid="option_color-filter"] svg').first().should('be.visible');
    cy.url().should('include', '?option_color=Black');

    cy.wait('@search-black').then(({ request }) => {
      const body = JSON.parse(request.body);
      expect(body.request.values.countFilters).to.equal('option_color ~ ["Black"]');
    });

    cy.get('[data-testid="option_color-filter"] label').first().click();
    cy.get('[data-testid="option_color-filter"] svg').first().should('not.be.visible');
    cy.url().should('not.include', '?option_color=Black');

    cy.wait('@search-black').then(({ request }) => {
      const body = JSON.parse(request.body);
      expect(body.request.values.countFilters).to.equal('');
    });
  });

  it('Should reset when reset button is clicked', () => {
    cy.get('[data-testid="option_color-filter"] label').first().click();
    cy.get('[data-testid="option_color-filter"] svg').first().should('be.visible');
    cy.url().should('include', '?option_color=Black');

    cy.get('[data-testid="option_color-filter"] div:nth-of-type(1) button').should('contain', 'Reset').click();
    cy.get('[data-testid="option_color-filter"] svg').first().should('not.be.visible');
    cy.url().should('not.include', '?option_color=Black');
  });
});
