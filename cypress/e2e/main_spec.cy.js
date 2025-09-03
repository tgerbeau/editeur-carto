function login(username, password) {
  cy.visit('https://ignf.github.io/cartes.gouv.fr-editeur-carto/')
  cy.contains('Connectez-vous pour commencer').click()
  cy.get('[name="username"]').type(username)
  cy.get('[name="password"]').type(password)
  cy.get('.fr-btns-group > [type="submit"]').click()
}

describe('Connexion utilisateur', () => {
  it('doit se connecter avec des identifiants valides', () => {
    const username = Cypress.env('username')
    const password = Cypress.env('password')
    login(username, password)
    cy.contains('Mon espace').should('be.visible')
  })
})