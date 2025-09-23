describe('Recherche d\'adresse', () => {
  it('doit permettre de rechercher une adresse et de sélectionner le premier résultat', () => {
    cy.visit('https://ignf.github.io/cartes.gouv.fr-editeur-carto/')
    cy.contains('Se connecter').click()
    cy.get('[name="username"]').type(Cypress.env('username'))
    cy.get('[name="password"]').type(Cypress.env('password'))
    cy.get('[data-action-id="login"]').click();
    cy.contains('Mon espace').should('be.visible')
    cy.get('.create').click() 
    cy.get('input[placeholder*="Rechercher un lieu"]').type('10 Rue de la Paix, 50100 Cherbourg-en-Cotentin{enter}')
    cy.get('input[placeholder*="Rechercher un lieu"]').should('have.length.greaterThan', 0)
    // Sélectionne le premier élément de la liste déroulante des résultats
    cy.get('input[placeholder*="Rechercher un lieu"]').first().click()
    // Vérifie que le résultat sélectionné s'affiche sur la carte ou dans le champ (adapte le sélecteur si besoin)
    cy.contains('10 Rue de la Paix, 50100 Cherbourg-en-Cotentin').should('be.visible')
  })
})