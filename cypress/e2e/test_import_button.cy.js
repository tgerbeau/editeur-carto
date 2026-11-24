// Importe un fichier local et vérifie qu'au moins une couche a été ajoutée à la carte.
function importLocalFile(filePath) {
  cy.get('[id^="GPshowLayersListPicto-"]')
    .invoke('text')
    .then((txt) => parseInt(txt, 10) || 0)
    .as('nbCouchesAvant')

  cy.get('[data-action="import-local"]').click()
  cy.get('#right-panel-action').should('have.attr', 'open')
  cy.get('#upload-file').selectFile(filePath, { force: true })
  cy.contains('#right-panel-action button', 'Importer').should('be.visible').click()

  // Le compteur du bouton « Couches » reflète l'ajout de la nouvelle couche
  cy.get('@nbCouchesAvant').then((avant) => {
    cy.get('[id^="GPshowLayersListPicto-"]', { timeout: 30000 })
      .invoke('text')
      .then((txt) => parseInt(txt, 10) || 0)
      .should('be.gt', avant)
  })

  cy.get('#right-panel-action').then(($panel) => {
    if ($panel.attr('open') !== undefined) {
      cy.wrap($panel).find('.ignf-panel__header button').first().click()
    }
  })
}

describe('Import de données locales', () => {
  beforeEach(() => {
    cy.login()
    // L'import local n'existe que dans l'éditeur de cartes, pas dans l'explorateur.
    cy.visit(Cypress.env('editorUrl'))
    cy.dismissWelcomePopup(true)
    cy.createMap()
  })

  const cas = [
    ['GeoJSON', 'cypress/fixtures/test.geojson'],
    ['CSV', 'cypress/fixtures/test.csv'],
    ['Shapefile (zip)', 'cypress/fixtures/test.zip'],
    ['GeoPackage', 'cypress/fixtures/test.gpkg'],
    ['GPX', 'cypress/fixtures/test.gpx'],
  ]

  cas.forEach(([format, fichier]) => {
    it(`importe un ${format}`, () => {
      importLocalFile(fichier)
      cy.get('[id^="GPshowLayersListPicto-"]').click()
      cy.get('[id^="GPlayerSwitcher_ID_"]').should('have.length.at.least', 3)
    })
  })
})
