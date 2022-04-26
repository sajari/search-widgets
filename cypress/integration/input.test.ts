import 'cypress-localstorage-commands';

const defaultConfigs = {
  account: '1603163345448404241',
  collection: 'sajari-test-fashion2',
  pipeline: 'query',
  preset: 'shopify',
  mode: 'typeahead',
  redirect: {
    url: '',
    queryParamName: 'q',
  },
};

const visitSearchInput = (configs = defaultConfigs) => {
  cy.setLocalStorage('code-content-search-input', JSON.stringify(configs));
  cy.setLocalStorage('active-widget', 'search-input');
  cy.visit('/');

  cy.get('#preview').find('[type="search"]').first().should('be.visible');
};

describe('Search Input', async () => {
  it('Should redirect after running a search', () => {
    visitSearchInput();

    cy.get('[type="search"]').first().type('shirt');
    cy.get('form').submit();
    cy.url().should('include', '?q=shirt');
  });

  it('Should show suggestions on suggestions mode', () => {
    cy.intercept('POST', '**/Search', { fixture: 'autocomplete' });

    visitSearchInput({ ...defaultConfigs, mode: 'suggestions' });

    cy.get('[type="search"]').first().type('shi');

    cy.get('h6').contains('Suggestions').should('be.visible');
  });

  it('Should show typeahead on typeahead mode', () => {
    cy.intercept('POST', '**/Search', { fixture: 'autocomplete' });
    visitSearchInput({ ...defaultConfigs, mode: 'typeahead' });

    cy.get('[type="search"]').first().type('shi');
    cy.get('[type="search"]').first().prev().should('have.text', 'shirt');
  });

  it('Should redirect to /search when redirect.url is "search"', () => {
    visitSearchInput({
      ...defaultConfigs,
      mode: 'typeahead',
      redirect: {
        url: 'search',
        queryParamName: 'q',
      },
    });

    cy.get('[type="search"]').first().type('shirt');
    cy.get('form').submit();
    cy.url().should('include', '/search?q=shirt');
  });
});
