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
    cy.get('[id^="GPshowLayersListPicto-"]', { timeout: 60000 }).should(($picto) => {
      expect(parseInt($picto.text(), 10) || 0).to.be.gt(avant)
    })
  })

  cy.get('#right-panel-action').then(($panel) => {
    if ($panel.attr('open') !== undefined) {
      cy.wrap($panel).find('.ignf-panel__header button').first().click()
    }
  })
}

describe('Import de données locales', () => {
  beforeEach(() => {
    cy.startEditor()
  })

  const cas = [
    ['GeoJSON', 'cypress/fixtures/test.geojson', ['test']],
    ['CSV', 'cypress/fixtures/test.csv', ['test']],
    ['Shapefile (zip)', 'cypress/fixtures/test.zip', ['ZICAD_2024']],
    ['GeoPackage', 'cypress/fixtures/test.gpkg', ['export']],
    ['GPX', 'cypress/fixtures/test.gpx', ['tracks', 'track_points']],
  ]

  // Les imports s'enchaînent dans la même carte et la même session, sans reconnexion.
  it('enchaîne les imports de tous les formats', () => {
    cas.forEach(([, fichier]) => importLocalFile(fichier))

    // Le bas du bouton reste accessible sous la barre de partage.
    cy.get('[id^="GPshowLayersListPicto-"]').click('bottom')
      .should('have.attr', 'aria-pressed', 'true')
    cy.get('[id^="GPlayersList-"]').should('be.visible').within(() => {
      cas.forEach(([, , couches]) => {
        couches.forEach((nom) => {
          cy.contains('[id^="GPtitle_ID_"]', new RegExp(`^${nom}$`)).should('be.visible')
        })
      })
    })
  })
})
