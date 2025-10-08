describe('Hello World Test', () => {
  it('affiche hello world dans les logs', () => {
     //cy.get('[name="username"]').type(Cypress.env('username'))
     cy.log('Username: ' + Cypress.env('username'))
     cy.log('Password: ' + Cypress.env('password'))
  })
})