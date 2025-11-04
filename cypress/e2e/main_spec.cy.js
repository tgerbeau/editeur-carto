function login(username, password) {
  cy.visit(Cypress.env('baseUrl'))
  cy.contains('Se connecter').click()
  cy.get('[name="username"]').type(username)
  cy.get('[name="password"]').type(password)
  cy.get('[data-action-id="login"]').click();
}

function checkMonEspaceElements() {
  cy.log('Vérification du menu Mon espace')
  cy.contains('Mon espace').click()
  cy.contains('Tableau de bord').should('be.visible')
  cy.contains('Mon compte').should('be.visible')
  cy.contains('Se déconnecter').should('be.visible')
  cy.contains('Mon espace').click()
}

function creerUneCarte() {
  cy.log('Création d\'une nouvelle carte')
  cy.get('.create').click()
  cy.get('.fr-text').should('have.text', 'Carte sans titre')
}

function verifierElementsVisuels() {
  cy.log('Vérification des éléments visuels de l’interface')
  cy.get('[id^="GPsearchInputText-32"]').should('be.visible')
  cy.get('[id*="bar"]').should('be.visible') // barre haut droite (avec id dynamique)
  cy.get('.ol-viewport').should('be.visible') // la carte elle-même 
}


describe('Tests utilisateur connecté', () => {
  before(() => {
    const username = Cypress.env('username')
    const password = Cypress.env('password')
    login(username, password)
    cy.contains('Mon espace').should('be.visible')
  })

  it('doit afficher les éléments du menu Mon espace', () => {
    checkMonEspaceElements()
    creerUneCarte()
    verifierElementsVisuels()
  })
})


