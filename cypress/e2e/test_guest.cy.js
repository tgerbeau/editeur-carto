describe('Visiteur non connecté', () => {
  it('charge la page publique de l’éditeur', () => {
    cy.visit(Cypress.env('baseUrl'))
    cy.title().should('contain', 'cartes.gouv.fr')
    cy.get('.ol-viewport').should('be.visible')
  })
})