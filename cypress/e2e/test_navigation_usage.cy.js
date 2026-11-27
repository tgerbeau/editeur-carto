describe('Parcours de navigation publics', () => {
  it('passe de Explorer à Découvrir puis revient à Explorer', () => {
    cy.visit(Cypress.env('baseUrl'))
    cy.dismissWelcomePopup(true)

    cy.contains('button', 'Services').filter(':visible').first().click()
    cy.contains('a', 'Découvrir cartes.gouv.fr', { timeout: 30000 })
      .filter(':visible')
      .click()
    cy.location('pathname', { timeout: 30000 }).should('match', /^\/decouvrir\/?$/)

    cy.contains('button', 'Services').filter(':visible').first().click()
    cy.contains('a', 'Explorer les cartes', { timeout: 30000 })
      .filter(':visible')
      .first()
      .click()
    cy.location('pathname', { timeout: 30000 }).should('match', /^\/explorer-les-cartes\/?$/)
  })

  it('passe de Explorer à la recherche de données', () => {
    cy.visit(Cypress.env('baseUrl'))
    cy.dismissWelcomePopup(true)

    cy.contains('button', 'Services').filter(':visible').first().click()
    cy.contains('a', 'Rechercher une donnée', { timeout: 30000 })
      .filter(':visible')
      .click()
    cy.location('pathname', { timeout: 30000 }).should('eq', '/rechercher-une-donnee/search')
    cy.get('input[placeholder="Rechercher dans le catalogue..."]', { timeout: 30000 }).should('be.visible')
  })

  it('ouvre la page de connexion depuis Explorer', () => {
    cy.visit(Cypress.env('baseUrl'))
    cy.dismissWelcomePopup(true)

    cy.get('a[href="/explorer-les-cartes/login"]').filter(':visible').first().click()
    cy.location('pathname', { timeout: 30000 }).should('match', /\/explorer-les-cartes\/login$/)
  })
})
