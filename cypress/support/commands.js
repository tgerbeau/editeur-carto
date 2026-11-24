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
  // Le menu se re-rend après ouverture : cy.contains réessaie jusqu'à trouver le bouton.
  cy.contains(`${CONNECTED_MARKER}:visible button`, 'Mon espace', { timeout: 30000 }).click()
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
  // Sondage silencieux : seul le clic « Fermer » apparaît dans le journal.
  cy.get('body', { log: false }).then(($body) => {
    const modal = $body.find(OPEN_MODAL).filter((_, dialog) => closeButtonsOf(Cypress.$(dialog)).length).first()
    if (modal.length) {
      const modalEl = modal.get(0)
      cy.wrap(closeButtonsOf(modal).first(), { log: false }).click()
      // La modale peut être retirée du DOM ou simplement fermée : on requête le body.
      cy.get('body', { log: false }).should(() => {
        expect(modalEl.isConnected && modalEl.hasAttribute('open')).to.eq(false)
      })
      if (attempt < 12) cy.dismissWelcomePopup(waitForAppearance, attempt + 1)
    } else if (waitForAppearance && attempt < 12) {
      cy.wait(250, { log: false }).then(() => cy.dismissWelcomePopup(true, attempt + 1))
    }
  })
})

// Ouvre l'éditeur de cartes (creer-une-carte). Son authentification (compte « Ma carte ») est
// distincte du SSO : on s'identifie via sa modale #login-modal si des identifiants éditeur existent.
const EDITOR_LOGIN_BTN = 'button[data-action="login"]:visible'

Cypress.Commands.add('openEditor', () => {
  const username = Cypress.env('editorUsername')
  const password = Cypress.env('editorPassword')

  cy.visit(Cypress.env('editorUrl'))
  cy.get('.ol-viewport', { timeout: 30000 }).should('be.visible')
  cy.dismissWelcomePopup(true)

  cy.get('body', { log: false }).then(($body) => {
    if (!username || !password || !$body.find(EDITOR_LOGIN_BTN).length) return
    cy.get(EDITOR_LOGIN_BTN).first().click()
    cy.get('#login-modal input[name="username"]', { timeout: 10000 }).should('be.visible')
      .clear().type(username, { log: false })
    cy.get('#login-modal input[name="password"]').clear().type(password, { log: false })
    cy.contains('#login-modal button', 'Se connecter').click()
    cy.get('body', { timeout: 30000 }).should(($b) => {
      expect($b.find('#login-modal[open]'), 'connexion éditeur refusée (vérifier CYPRESS_EDITOR_USERNAME/PASSWORD)').to.have.length(0)
      expect($b.find(EDITOR_LOGIN_BTN), 'bouton « Se connecter » encore visible').to.have.length(0)
    })
  })
})

// L'éditeur ignore silencieusement l'enregistrement sans connexion : on échoue explicitement.
function assertEditorAuthenticated() {
  cy.get('body', { log: false }).then(($body) => {
    if ($body.find(EDITOR_LOGIN_BTN).length) {
      throw new Error("L'enregistrement nécessite un compte éditeur « Ma carte » : renseigner CYPRESS_EDITOR_USERNAME et CYPRESS_EDITOR_PASSWORD dans .env")
    }
  })
}

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
      cy.get('button[aria-label="Gestion ma carte"]').click()
    }
  })
  cy.get(`[data-action="${action}"]`).filter(':visible').first().click()
})

// Enregistre la carte courante avec un nom et une thématique, et attend la fermeture de la modale.
Cypress.Commands.add('saveMap', (name, theme = 'Agriculture') => {
  assertEditorAuthenticated()
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