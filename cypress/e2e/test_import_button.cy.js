function testImportButton(filePath, logMsg) {
  cy.visit('https://ignf.github.io/cartes.gouv.fr-editeur-carto/')
  cy.contains('Se connecter').click()
  cy.get('[name="username"]').type(Cypress.env('username'))
  cy.get('[name="password"]').type(Cypress.env('password'))  
  cy.get('[data-action-id="login"]').click();
  cy.contains('Mon espace').should('be.visible')
  cy.get('.create').click()  
  cy.get('#ol-button-137').click()
  cy.get("#upload-file").click();
  cy.get("#upload-file").selectFile(filePath)
  cy.get('.fr-mt-2w > .fr-btn').should('be.visible').click()
  cy.get('[id^="fr-message--"]')
  .should('exist')
  .each(($message) => {
    // Faire quelque chose pour chaque message trouvé
    cy.wrap($message).should('be.visible');
  });
  cy.log(logMsg)
}

describe('Test bouton Import', () => {
  it('importe un GeoJSON', () => {
    testImportButton('cypress/fixtures/test.geojson', 'Import GeoJSON OK')
  })
  it('importe un CSV', () => {
    testImportButton('cypress/fixtures/test.csv', 'Import CSV OK')
  })
  it('importe un Shapefile', () => {
    testImportButton('cypress/fixtures/test.zip', 'Import Shapefile OK')
  })
  it('importe un GeoPackage', () => {
    testImportButton('cypress/fixtures/test.gpkg', 'Import GeoPackage OK')
  })
  it('importe un GPX', () => {
    testImportButton('cypress/fixtures/test.gpx', 'Import GPX OK')
  })
})
