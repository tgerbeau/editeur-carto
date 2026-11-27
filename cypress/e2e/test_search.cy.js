describe("Recherche d'adresse", () => {
  it('propose des résultats et recentre la carte sur le premier', () => {
    cy.visit(Cypress.env('baseUrl'))
    cy.dismissWelcomePopup(true)
    cy.createMap()

    cy.fixture('adresse').then((data) => {
      cy.get('.ol-scale-line-inner').invoke('text').as('echelleInitiale')

      cy.get('[id^="GPsearchInputText"]').filter(':visible').first().clear()
      cy.get('[id^="GPsearchInputText"]').filter(':visible').first().type(data.adresse)
      cy.get('[id^="GPsearchInputText"]').filter(':visible').first()
        .should('have.value', data.adresse)

      // Les propositions d'autocomplétion arrivent du service de géocodage
      cy.get('[id^="GPautoCompleteList"]:visible li', { timeout: 30000 })
        .should('have.length.at.least', 1)
        .first()
        .should('contain.text', 'Orfèvres')
        .click()

      // La carte a zoomé sur le résultat
      cy.get('@echelleInitiale').then((avant) => {
        cy.get('.ol-scale-line-inner', { timeout: 30000 }).should('not.have.text', avant)
      })

      cy.contains('La couche est ajoutée à la carte', { timeout: 30000 }).should('not.exist')
      cy.get('.ol-viewport canvas', { timeout: 30000 })
        .should('be.visible')
        .and(($canvas) => {
          expect($canvas[0].width).to.be.greaterThan(0)
          expect($canvas[0].height).to.be.greaterThan(0)
        })
      cy.screenshot('recherche-36-quai-des-orfevres')
    })
  })
})
