// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('loginSession', (username, password) => {
  cy.session([username, password], () => {
    cy.visit('https://ignf.github.io/cartes.gouv.fr-editeur-carto/')
    cy.contains('Connectez-vous pour commencer').click()
    cy.get('[name="username"]').type(username)
    cy.get('[name="password"]').type(password)
    cy.get('.fr-btns-group > [type="submit"]').click()
    cy.contains('Mon espace').should('be.visible')
  })
})

Cypress.Commands.add('createMapWithPopupHandling', () => {
  cy.get('.create').click()
  
  // Wait for page to load
  cy.wait(800)
  
  // Check if ConnectDialog popup appears and click "Voir mes cartes"
  cy.get('#ConnectDialog').then(($dialog) => {
    if ($dialog.is(':visible')) {
      cy.log('Popup "Créer votre carte" détectée - clic sur "Voir mes cartes"')
      // Click on "Voir mes cartes" button/link
      cy.get('#ConnectDialog').contains(/Voir mes cartes/i).click()
      cy.wait(300)
    } else {
      cy.log('Pas de popup - continue normalement')
    }
  }).then(() => {
    cy.log('Création de carte terminée')
  })
})