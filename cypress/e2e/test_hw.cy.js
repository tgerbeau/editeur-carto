describe('Hello World Test', () => {
  it('affiche hello world dans les logs', () => {
     const username = Cypress.env('CYPRESS_USERNAME');
     const password = Cypress.env('CYPRESS_PASSWORD');
     cy.get('[name="username"]').type(username)
     cy.log('Username: ' + username)
     cy.log('Password: ' + password)
  })
})