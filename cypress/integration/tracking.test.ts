describe('Tracking', async () => {
  it('Should send track event upon item click', () => {
    cy.visit('/');
    cy.get('#toolbar button').click();
    cy.get('[role="listbox"] [role="option"]:nth-child(5)').click();

    // Wait for input to appear. Without the line, Github CI normally fails
    // to detect the element and is causing the test to fail
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);

    cy.intercept({ method: 'POST', url: '*:trackEvent' }).as('trackEvent');
    cy.get('article h3 > a').first().click();
    cy.wait('@trackEvent')
      .its('request.body')
      .then((body) => {
        const params = JSON.parse(body);

        expect(params.type).to.equal('add_to_cart');
      });
  });
});
