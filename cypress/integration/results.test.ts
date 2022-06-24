const visitSearchResults = (url = '/') => {
  localStorage.setItem('active-widget', 'search-results');
  cy.visit(url);
};

describe('Search Results', async () => {
  it('Should sync input query with URL bar', () => {
    cy.intercept('POST', '**/Search', { body: {} });
    visitSearchResults();
    cy.get('input[type="search"]').first().type('shirt');
    cy.get('input[type="search"]').first().should('have.value', 'shirt');
    cy.url().should('include', '?q=shirt');
  });

  it('Should search with query params', () => {
    cy.intercept('POST', '**/Search', { body: {} });
    visitSearchResults('/?q=jacket');
    cy.get('input[type="search"]').first().should('have.value', 'jacket');
  });
});

describe('Network count', async () => {
  it('Should call /Search API only once after init app', () => {
    let count = 0;
    cy.intercept('POST', '**/Search', { body: {} });
    cy.intercept('POST', '**/Search', () => {
      count += 1;
    }).as('search');

    visitSearchResults();

    cy.wait('@search').then(() => {
      expect(count).to.equal(1);
    });
  });

  it('Should call /Search API only once if URL params is available', () => {
    let count = 0;
    cy.intercept('POST', '**/Search', { body: {} });
    cy.intercept('POST', '**/Search', () => {
      count += 1;
    }).as('search');

    visitSearchResults('/?q=test&show=25&sort=max_price&vendor=Hannes+Roether');

    cy.wait('@search').then(() => {
      expect(count).to.equal(1);
    });
  });
});

describe('Pagination', async () => {
  beforeEach(() => {
    cy.viewport(1440, 720);
    cy.intercept('POST', '**/Search', { fixture: 'promotion' }).as('search');
  });

  it('Should match the max page and current page', () => {
    visitSearchResults();
    cy.wait('@search')
      .then(({ response }) => {
        expect(response).property('statusCode').to.eq(200);
        expect(response)
          .property('body')
          .property('searchResponse')
          .property('totalResults')
          .to.not.be.oneOf([null, '']);
        return response?.body.searchResponse.totalResults;
      })
      .as('totalResults');

    cy.get('button[id^="page-size"]').invoke('text').as('pageSize');

    cy.get('nav[data-testid="pagination"]').children('[aria-label^="Page"]').last().invoke('text').as('maxPage');

    cy.get('@totalResults').then((totalResults) => {
      cy.get('@pageSize').then((pageSize) => {
        cy.get('@maxPage').then((maxPage) => {
          expect(Number(maxPage)).to.eq(Math.ceil(Number(totalResults) / Number(pageSize)));
        });
      });
    });

    cy.get('nav[data-testid="pagination"]')
      .children('[aria-label^="Page"]')
      .first()
      .should('have.attr', 'aria-label', 'Page 1, current page');
  });

  it('Should match the request when changing page number', () => {
    visitSearchResults();
    cy.wait('@search').then(({ request }) => {
      expect(JSON.parse(request.body)).property('request').property('values').not.property('page');
    });

    cy.get('button[id^="page-size"]').invoke('text').as('pageSize');
    cy.get('nav[data-testid="pagination"]').children('[aria-label^="Page"]').first().next().click();

    cy.wait('@search')
      .then(({ request, response }) => {
        expect(JSON.parse(request.body)).property('request').property('values').property('page').to.eq('2');
        expect(response).property('statusCode').to.eq(200);
        expect(response)
          .property('body')
          .property('searchResponse')
          .property('totalResults')
          .to.not.be.oneOf([null, '']);
        return response?.body.searchResponse.totalResults;
      })
      .as('totalResults');
    cy.get('nav[data-testid="pagination"]').children('[aria-label^="Page"]').last().invoke('text').as('maxPage');

    cy.get('nav[data-testid="pagination"]')
      .children('[aria-label^="Page"]')
      .first()
      .next()
      .should('have.attr', 'aria-label', 'Page 2, current page');
  });
});

describe('Result items display', async () => {
  beforeEach(() => {
    cy.viewport(1440, 720);
    cy.intercept('POST', '**/Search', { fixture: 'promotion' }).as('search');
  });

  it('Should match the view widget', () => {
    visitSearchResults();

    cy.wait('@search');

    cy.get('button[aria-label="Grid"]').should('not.have.css', 'background-color', 'rgb(255, 255, 255)');
    cy.get('button[aria-label="List"]').should('have.css', 'background-color', 'rgb(255, 255, 255)');
    cy.get('article[data-testid="result-item"]').parent().should('have.css', 'display', 'grid');

    cy.get('button[aria-label="List"]').click();
    cy.url().should('include', 'viewType=list');
    cy.get('button[aria-label="Grid"]').should('have.css', 'background-color', 'rgb(255, 255, 255)');
    cy.get('button[aria-label="List"]').should('not.have.css', 'background-color', 'rgb(255, 255, 255)');
    cy.get('article[data-testid="result-item"]').parent().should('have.css', 'display', 'flex');
  });

  it('Should match the query params', () => {
    visitSearchResults('/?viewType=list');

    cy.wait('@search');

    cy.get('button[aria-label="Grid"]').should('have.css', 'background-color', 'rgb(255, 255, 255)');
    cy.get('button[aria-label="List"]').should('not.have.css', 'background-color', 'rgb(255, 255, 255)');
    cy.get('article[data-testid="result-item"]').parent().should('have.css', 'display', 'flex');
  });
});

describe('Promotions', async () => {
  beforeEach(() => {
    cy.viewport(2560, 1440);
    cy.intercept('POST', '**/Search', { fixture: 'promotion' }).as('search');
  });

  it('Should match the pin items', () => {
    visitSearchResults();

    cy.wait('@search');

    cy.get('[data-testid="result-item"]:first').should('have.attr', 'data-pinned', 'true');
    cy.get('[data-testid="result-item"]:nth-child(2)').should('have.attr', 'data-pinned', 'true');
    cy.get('[data-testid="result-item"]:nth-child(3)').should('not.have.attr', 'data-pinned');
    cy.get('[data-testid="result-item"]:nth-child(4)').should('not.have.attr', 'data-pinned');
  });

  it('Should match the result values', () => {
    visitSearchResults();

    cy.wait('@search').then(({ response }) => {
      const item = response?.body.searchResponse.results[0];
      cy.get('[data-testid="result-item"]')
        .first()
        .within(() => {
          cy.get('img').should('have.attr', 'src', item.values.image_url.single);
          cy.get('h3').contains(item.values.title.single);
          cy.get('p').contains(item.values.vendor.single);
        });
    });
  });
});

describe('Banners', async () => {
  beforeEach(() => {
    cy.viewport(2560, 1440);
  });

  it('Should match the banner item', () => {
    cy.intercept('POST', '**/Search', { fixture: 'banner' }).as('search');
    visitSearchResults();

    cy.wait('@search').then(({ response }) => {
      const banners = response?.body.banners;
      cy.get('article[data-testid="result-item"]')
        .parent()
        .within(() => {
          cy.get(':first')
            .should('have.css', 'grid-column-end', `span ${banners[0].width}`)
            .should('have.css', 'grid-row-end', `span ${banners[0].height}`)
            .within(() => {
              cy.get('a').should('have.attr', 'href', banners[0].targetUrl);
              cy.get('img').should('have.attr', 'src', banners[0].imageUrl);
            });
          cy.get(':nth-child(8)')
            .should('have.css', 'grid-column-end', `span ${banners[1].width}`)
            .should('have.css', 'grid-row-end', `span ${banners[1].height}`)
            .within(() => {
              cy.get('a').should('have.attr', 'href', banners[1].targetUrl);
              cy.get('img').should('have.attr', 'src', banners[1].imageUrl);
            });
          cy.get(':nth-child(10)')
            .should('have.css', 'grid-column-end', `span ${banners[2].width}`)
            .should('have.css', 'grid-row-end', `span ${banners[2].height}`)
            .within(() => {
              cy.get('a').should('have.attr', 'href', banners[2].targetUrl);
              cy.get('img').should('have.attr', 'src', banners[2].imageUrl);
            });
        });
    });
  });
});

describe('Custom result template', async () => {
  it('Should match the custom result template', () => {
    cy.intercept('POST', '**/Search', { fixture: 'banner' }).as('search');
    cy.fixture('template').then((template) => {
      localStorage.setItem('code-content-search-results', template);
    });
    visitSearchResults();

    cy.wait('@search');
    cy.get('article.item')
      .should('exist')
      .should('have.css', 'display', 'block')
      .should('have.css', 'text-align', 'center')
      .within(() => {
        cy.get('.item__image-wrapper').should('exist');
        cy.get('.item__title').should('exist');
        cy.get('.item__vendor').should('exist');
        cy.get('.item__price').should('exist');
      });
  });
});

describe('Custom default value of variables', async () => {
  it.only('Custom resultsPerPage should work', () => {
    const config: any = {
      account: '1603163345448404241',
      collection: 'sajari-test-fashion2',
      pipeline: 'query',
      preset: 'shopify',
      variables: {
        resultsPerPage: 25,
      },
    };
    localStorage.setItem('code-content-search-results', JSON.stringify(config));
    cy.intercept('POST', '**/Search', { fixture: 'promotion' }).as('search');
    visitSearchResults();
    cy.url().should('not.include', 'show');

    cy.get('[data-testid="results-per-page"]')
      .click()
      .within(() => {
        cy.get('li:nth-child(1)').click();
      });

    cy.url().should('include', 'show=15');

    cy.get('[data-testid="results-per-page"]')
      .click()
      .within(() => {
        cy.get('li:nth-child(2)').click();
      });

    cy.url().should('not.include', 'show');
  });
});

describe.only('Custom urlParams', async () => {
  const config: any = {
    account: '1603163345448404241',
    collection: 'sajari-test-fashion2',
    pipeline: 'query',
    preset: 'shopify',
    options: {
      urlParams: {
        q: 'query',
      },
    },
  };

  it('Should change default value of q param', () => {
    localStorage.setItem('code-content-search-results', JSON.stringify(config));
    cy.intercept('POST', '**/Search', { fixture: 'promotion' }).as('search');
    visitSearchResults();

    cy.get('input[type="search"]').first().type('shirt');
    cy.get('input[type="search"]').first().should('have.value', 'shirt');
    cy.url().should('include', '?query=shirt');
  });

  it('Should sync state from URL param', () => {
    localStorage.setItem('code-content-search-results', JSON.stringify(config));
    cy.intercept('POST', '**/Search', { fixture: 'promotion' }).as('search');
    visitSearchResults('/?query=test');

    cy.get('input[type="search"]').first().should('have.value', 'test');
  });
});
