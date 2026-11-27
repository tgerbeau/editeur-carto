describe('Connexion', () => {
  it("se connecte et affiche l'éditeur", () => {
    cy.login()
    cy.title().should('contain', 'cartes.gouv.fr')
    cy.get('.ol-viewport').should('be.visible')
  })
})
