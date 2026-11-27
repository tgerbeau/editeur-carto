describe('Parcours de sauvegarde de carte', () => {
  it('crée une nouvelle carte et la sauvegarde', () => {
    const titreCarte = 'Carte QA sauvegarde ' + Date.now()

    cy.login()
    cy.openEditor()
    cy.createMap()
    cy.saveMap(titreCarte, 'Agriculture')
  })
})
