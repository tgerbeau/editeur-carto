describe('Hello World Test', () => {
  it('affiche hello world dans les logs', () => {
     cy.visit(Cypress.env('baseUrl'))
     cy.contains('Se connecter').click()
     const username = Cypress.env('CYPRESS_USERNAME') || 'default_value';
     const password = Cypress.env('CYPRESS_PASSWORD')|| 'default_value';
     cy.log('Username: ' + username)
     cy.log('Password: ' + password)
     cy.get('[name="username"]').type(username)
     cy.get('[name="password"]').type(password)
     cy.log('Username: ' + username)
     cy.log('Password: ' + password)
     cy.get('[data-action-id="login"]').click();
  })
})