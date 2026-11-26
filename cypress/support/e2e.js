// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

Cypress.on('window:before:load', (win) => {
  const observer = new win.MutationObserver(() => {
    win.document.querySelectorAll('dialog[open]').forEach((dialog) => {
      const heading = Array.from(dialog.querySelectorAll('h1, h2, h3, h4, h5, h6'))
        .find((element) => element.textContent.trim() === 'Bienvenue sur cartes.gouv.fr')
      if (!heading) return

      const close = Array.from(dialog.querySelectorAll('button'))
        .find((button) => button.textContent.trim() === 'Fermer')
      if (close) close.click()
    })
  })
  observer.observe(win.document, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['open'],
    characterData: true,
  })
})
