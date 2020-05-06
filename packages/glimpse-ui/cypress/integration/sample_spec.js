describe('My first test', () => {
  it('Clickss an element', () => {
    cy.visit('https://example.cypress.io')
    cy.contains('type').click()

    cy.url().should('include', '/commands/actions')
  })
})
