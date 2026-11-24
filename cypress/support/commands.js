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

const appHostname = () => new URL(Cypress.env('baseUrl')).hostname

const CONNECTED_MARKER = 'nav[aria-label="Mon espace"]'

// La prod ne redirige pas automatiquement vers le SSO : on passe par <baseUrl>login.
const isProd = () => appHostname() === 'cartes.gouv.fr'

// Connexion via le SSO Géoplateforme (Keycloak, origine différente de l'application).
// Sans identifiants (ex. environnement avec utilisateur mocké), on se contente de charger l'application.
// La session est mise en cache : une seule authentification par run.
Cypress.Commands.add('login', () => {
  const username = Cypress.env('username')
  const password = Cypress.env('password')
  const baseUrl = Cypress.env('baseUrl')

  if (!username || !password) {
    cy.log('Identifiants absents : pas de connexion SSO')
    cy.visit(baseUrl)
    cy.get('.ol-viewport', { timeout: 30000 }).should('be.visible')
    dismissWelcomePopup()
    return
  }

  const authenticate = () => {
    cy.visit(baseUrl)
    if (isProd()) {
      cy.get('.ol-viewport', { timeout: 30000 }).should('be.visible')
      dismissWelcomePopup()
      cy.visit(new URL('login', baseUrl).toString())
      cy.location('hostname', { timeout: 30000 }).should('eq', 'sso.geopf.fr')
      cy.origin('https://sso.geopf.fr', { args: { username, password } }, ({ username, password }) => {
        Cypress.on('uncaught:exception', () => false)
        cy.get('input[name="username"], input#username', { timeout: 30000 })
          .first().clear().type(username, { log: false })
        cy.get('input[name="password"], input#password')
          .first().clear().type(password, { log: false })
        cy.get('#kc-login, button[type="submit"], input[type="submit"]').first().click()
      })
      cy.location('hostname', { timeout: 30000 }).should('eq', appHostname())
    } else {
      // L'éditeur GitHub Pages redirige vers le SSO après son chargement.
      cy.location('hostname', { timeout: 30000 }).should('not.eq', appHostname())
      cy.location('origin').then((ssoOrigin) => {
        cy.origin(ssoOrigin, { args: { username, password } }, ({ username, password }) => {
          Cypress.on('uncaught:exception', () => false)
          cy.get('#kc-form-login', { timeout: 30000 }).should('be.visible')
          cy.get('input[name="username"]').clear().type(username, { log: false })
          cy.get('input[name="password"]').clear().type(password, { log: false })
          cy.get('#kc-login').click()
        })
      })
      cy.location('hostname', { timeout: 30000 }).should('eq', appHostname())
    }
    assertAuthenticated()
  }

  cy.session(['editeur-carto', username], authenticate, {
    cacheAcrossSpecs: true,
    validate() {
      cy.visit(baseUrl)
      assertAuthenticated()
    },
  })

  cy.visit(baseUrl)
  assertAuthenticated()
})

function assertAuthenticated() {
  cy.get('.ol-viewport', { timeout: 30000 }).should('be.visible')
  dismissWelcomePopup()
  cy.viewport(375, 812)
  cy.get('#button-menu').should('be.visible').click()
  // Le menu se re-rend après ouverture : on requête à chaque étape plutôt que de chaîner.
  cy.get(`${CONNECTED_MARKER}:visible`, { timeout: 30000 }).should('exist')
  cy.get(`${CONNECTED_MARKER}:visible button`).filter(':contains("Mon espace")').last().click()
  cy.get(`${CONNECTED_MARKER} a[href$="/explorer-les-cartes/login"]`).should('not.exist')
  cy.get('#close-button').click()
  cy.viewport(1280, 800)
}

function dismissWelcomePopup() {
  cy.dismissWelcomePopup(true)
}

// Ferme toute modale DSFR ouverte (bienvenue, invitation à se connecter, ...) via son bouton « Fermer ».
// #ConnectDialog est exclu : cy.createMap() le traite avec « Créer une carte ».
const OPEN_MODAL = 'dialog[open]:not(#ConnectDialog)'
const closeButtonsOf = ($dialog) =>
  $dialog.find('button').filter((_, btn) => btn.innerText.trim() === 'Fermer')

Cypress.Commands.add('dismissWelcomePopup', (waitForAppearance = false, attempt = 0) => {
  cy.get('body').then(($body) => {
    const modal = $body.find(OPEN_MODAL).filter((_, dialog) => closeButtonsOf(Cypress.$(dialog)).length).first()
    if (modal.length) {
      const modalEl = modal.get(0)
      cy.wrap(closeButtonsOf(modal).first()).click()
      // La modale peut être retirée du DOM ou simplement fermée : on requête le body.
      cy.get('body').should(($b) => {
        expect(modalEl.isConnected && modalEl.hasAttribute('open')).to.eq(false)
      })
      if (attempt < 12) cy.dismissWelcomePopup(waitForAppearance, attempt + 1)
    } else if (waitForAppearance && attempt < 12) {
      cy.wait(250, { log: false }).then(() => cy.dismissWelcomePopup(true, attempt + 1))
    }
  })
})

// Ferme la boîte d'accueil si elle est affichée et attend la carte vierge.
Cypress.Commands.add('createMap', () => {
  cy.get('.ol-viewport', { timeout: 30000 }).should('be.visible')
  cy.get('body').then(($body) => {
    if ($body.find('#ConnectDialog[open]').length) {
      cy.contains('#ConnectDialog button', 'Créer une carte').click()
      cy.get('#ConnectDialog').should('not.have.attr', 'open')
    }
  })
})

// Ouvre le menu « Gérer ma carte » et déclenche l'action demandée (save-map, open-map, ...).
// Certaines actions existent en double dans le DOM : on ne cible que l'élément visible.
Cypress.Commands.add('mapMenuAction', (action) => {
  cy.get(`[data-action="${action}"]`).then(($btn) => {
    if (!$btn.filter(':visible').length) {
      cy.contains('button', 'Gérer ma carte').click()
    }
  })
  cy.get(`[data-action="${action}"]`).filter(':visible').first().click()
})

// Enregistre la carte courante avec un nom et une thématique, et attend la fermeture de la modale.
Cypress.Commands.add('saveMap', (name, theme = 'Agriculture') => {
  cy.mapMenuAction('save-map')
  cy.get('input[name="name"]', { timeout: 10000 }).should('be.visible').clear().type(name)
  cy.get('#save-theme').select(theme)
  cy.get('input[name="name"]')
    .closest('dialog, .fr-modal')
    .find('.fr-modal__footer button')
    .first()
    .click()
  cy.get('input[name="name"]', { timeout: 15000 }).should('not.be.visible')
  cy.get('.map-title', { timeout: 15000 }).should('contain.text', name)
})