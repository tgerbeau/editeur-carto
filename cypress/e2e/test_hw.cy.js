describe('Hello World Test', () => {
  it('affiche hello world dans les logs', () => {
     cy.get('[name="username"]').type(Cypress.env('username'))
    cy.log('hello world')
  })
})