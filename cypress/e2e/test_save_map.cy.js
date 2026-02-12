describe('Parcours de sauvegarde de carte', () => {
  it('crée une carte, ajoute un titre et sauvegarde', () => {
    cy.visit(Cypress.env('baseUrl'))
    cy.contains('Se connecter').click()
    cy.get('[name="username"]').type(Cypress.env('username'))
    cy.get('[name="password"]').type(Cypress.env('password'))
    cy.get('[data-action-id="login"]').click()
    cy.contains('Mon espace').should('be.visible')

    // Création d'une nouvelle carte
    cy.createMapWithPopupHandling()
    cy.get('.fr-text').should('have.text', 'Carte sans titre')

    // Clique sur savegarde pour Ajout d'un titre à la carte
    const titreCarte = 'Carte de test sauvegarde QA'

    cy.get('[data-action="save-map"]').first().click({ force: true })
    // Add titre carte
    cy.get('[name="name"]').clear().type(titreCarte)
    // Thématique
    cy.get('#save-theme').select('Agriculture')
    cy.get("div.fr-modal__footer button:nth-of-type(1)").click(); 

    // Wait for modal to close and title to update
    cy.get('div.fr-modal__footer button:nth-of-type(1)').should('not.be.visible')
    cy.get('.fr-text', { timeout: 15000 }).should('have.text', titreCarte)    
    
  })
})