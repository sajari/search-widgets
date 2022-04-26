const defaultConfig: any = {
  account: '1603163345448404241',
  collection: 'sajari-test-fashion2',
  pipeline: 'query',
  preset: 'shopify',
  selector: "input[name='q']",
  mode: 'suggestions',
  redirect: { url: 'search', queryParamName: 'q' },
};

const visitTakeoverInput = (config = defaultConfig) => {
  cy.setLocalStorage('code-content-search-input-binding', JSON.stringify(config));
  cy.setLocalStorage('active-widget', 'search-input-binding');
  cy.visit('/');
};

describe('Search Takeover Input', async () => {
  beforeEach(() => {
    cy.viewport(1440, 720);
  });

  it('Should redirect after running a search', () => {
    visitTakeoverInput();
    cy.get('form input').first().type('shirt', { force: true, delay: 1000 });
    cy.get('form').first().submit();

    cy.url().should('include', '/search?q=shirt');
  });

  it('Should show the dropdown', () => {
    visitTakeoverInput();
    cy.get('form input').first().type('dress', { force: true, delay: 500 });

    cy.get('ul li').contains('dress').should('be.visible');
  });

  it('Should mount the input to a different element base on the selector', () => {
    visitTakeoverInput({
      ...defaultConfig,
      selector: '#js-search-input',
    });

    cy.get('form input').first().type('dress', { force: true, delay: 500 });

    cy.get('ul[role="listbox"]').each((element) => {
      cy.wrap(element).should('not.be.visible');
    });

    cy.get('#js-search-input input').first().type('dress', { force: true, delay: 500 });

    cy.get('ul li').contains('dress').should('be.visible');
  });

  it('Should remove elements according to the `omittedElementSelectors` prop', () => {
    visitTakeoverInput({
      ...defaultConfig,
      omittedElementSelectors: '#js-search-input',
    });

    cy.get('#js-search-input').should('not.exist');
  });

  it('Should show dropdown on results mode', () => {
    cy.intercept({ url: '**/Search', method: 'POST' });
    visitTakeoverInput({ ...defaultConfig, mode: 'results' });

    cy.get('form input').first().type('shirt', { force: true, delay: 500 });
    cy.get('h6').contains('Results').should('be.visible');
  });
});
