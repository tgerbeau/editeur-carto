function checkMonEspaceElements() {
  cy.log('Vérification du menu Mon espace')
  cy.get('nav#mon-espace').filter(':visible').first().within(() => {
    cy.contains('button', 'Mon espace').click()
    cy.contains('a', 'Tableau de bord').should('be.visible')
    cy.contains('a', 'Mon compte').should('be.visible')
    cy.contains('a', 'Se déconnecter').should('be.visible')
    cy.contains('button', 'Mon espace').click()
  })
}

function verifierElementsVisuels() {
  cy.log('Vérification des éléments visuels de l’interface')
  cy.get('[id^="GPsearchInputText"]').filter(':visible').should('have.length.at.least', 1)
  cy.get('[id^="GPshowLayersListPicto-"]').should('be.visible')
  cy.get('.ol-viewport').should('be.visible')
}

describe('Tests utilisateur connecté', () => {
  beforeEach(() => {
    cy.login()
  })

  it('doit afficher les éléments du menu Mon espace', () => {
    checkMonEspaceElements()
    cy.createMap()
    verifierElementsVisuels()
  })
})


