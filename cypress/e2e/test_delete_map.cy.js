describe('Gestion de carte', () => {
  it('crée, sauvegarde et supprime une carte', () => {
    const nomCarte = 'Carte QA suppression ' + Date.now()

    cy.login()
    cy.openEditor()
    cy.createMap()
    cy.saveMap(nomCarte)

    // Retour à l'espace utilisateur de l'éditeur
    cy.visit(Cypress.env('editorUrl') + '?view=user-space')
    cy.dismissWelcomePopup(true)

    // On cible la plus petite carte (ancêtre) ne contenant qu'un seul bouton de suppression :
    // on évite ainsi de supprimer une autre carte de la liste.
    const supprimerBtn = '[data-action="delete"]'
    cy.contains(nomCarte, { timeout: 15000 })
      .should('be.visible')
      .parents()
      .filter((_, el) => Cypress.$(el).find(supprimerBtn).length === 1)
      .first()
      .find(supprimerBtn)
      .click({ force: true })

    // Confirmation dans la modale ouverte
    cy.get('dialog[open], .fr-modal--opened')
      .filter(':visible')
      .last()
      .contains('.fr-modal__footer button', 'Supprimer')
      .click()

    cy.contains(nomCarte, { timeout: 15000 }).should('not.exist')

    // La suppression est persistée côté serveur
    cy.reload()
    cy.get('.ol-viewport', { timeout: 30000 }).should('be.visible')
    cy.contains(nomCarte).should('not.exist')
  })
})

