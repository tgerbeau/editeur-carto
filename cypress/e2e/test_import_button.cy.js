function testImportButton(filePath, logMsg) {
  cy.visit(Cypress.env('baseUrl'))
  cy.contains('Se connecter').click()
  cy.get('[name="username"]').type(Cypress.env('CYPRESS_USERNAME'))
  cy.get('[name="password"]').type(Cypress.env('CYPRESS_PASSWORD'))  
  cy.get('[data-action-id="login"]').click();
  cy.contains('Mon espace').should('be.visible')
  cy.get('.create').click()  
  cy.get('[aria-label="Importer une donnée locale"]').click()
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
    cy.get('#right-panel-action > .ignf-panel__header > .ignf-panel__buttons > .fr-btn').click()
    cy.get('[id^="GPlayerSwitcher_ID_"]').should('have.length.greaterThan', 1)
})
  it('importe un CSV', () => {
    testImportButton('cypress/fixtures/test.csv', 'Import CSV OK')
    cy.get('#right-panel-action > .ignf-panel__header > .ignf-panel__buttons > .fr-btn').click()
    cy.get('[id^="GPlayerSwitcher_ID_"]').should('have.length.greaterThan', 1)
  })
  it('importe un Shapefile', () => {
    testImportButton('cypress/fixtures/test.zip', 'Import Shapefile OK')
    cy.get('#right-panel-action > .ignf-panel__header > .ignf-panel__buttons > .fr-btn').click()
    cy.get('[id^="GPlayerSwitcher_ID_"]').should('have.length.greaterThan', 1)
  })
  it('importe un GeoPackage', () => {
    testImportButton('cypress/fixtures/test.gpkg', 'Import GeoPackage OK')
    cy.get('#right-panel-action > .ignf-panel__header > .ignf-panel__buttons > .fr-btn').click()
    cy.get('[id^="GPlayerSwitcher_ID_"]').should('have.length.greaterThan', 1)
  })
  it('importe un GPX', () => {
    testImportButton('cypress/fixtures/test.gpx', 'Import GPX OK')
    cy.get('#right-panel-action > .ignf-panel__header > .ignf-panel__buttons > .fr-btn').click()
    cy.get('[id^="GPlayerSwitcher_ID_"]').should('have.length.greaterThan', 2)
  })


})
