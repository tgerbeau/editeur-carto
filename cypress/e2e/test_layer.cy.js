describe('Module Couche de données', () => {
  it('affiche et active une couche de données', () => {
    cy.visit(Cypress.env('baseUrl'))
    cy.contains('Se connecter').click()
    cy.get('[name="username"]').type(Cypress.env('username'))
    cy.get('[name="password"]').type(Cypress.env('password'))
    cy.get('[data-action-id="login"]').click();
    cy.contains('Mon espace').should('be.visible')
    cy.get('.create').click() 
    cy.get('[id^="GPshowLayersListPicto-"]').click()
    //cy.get('[id^="GPlayersList-"]    // Ouvre le module Couche de données (adapte le sélecteur si besoin)
    cy.contains('Couches de données').click()

    // Vérifie qu'il y a au moins un élément GPlayerSwitcher_ID_
    cy.get('[id^="GPlayerSwitcher_ID_"]').should('have.length.greaterThan', 0)

    // Vérifie l'effet sur la carte (adapte le sélecteur ou la vérification selon ton application)
    cy.get('.ol-viewport').should('be.visible')
  })
})