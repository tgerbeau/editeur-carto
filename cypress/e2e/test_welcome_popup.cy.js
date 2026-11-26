describe('Fenêtre de bienvenue', () => {
  it('ferme automatiquement la fenêtre avec le bouton Fermer', () => {
    let clicks = 0
    cy.on('window:before:load', (win) => {
      win.document.addEventListener('click', (event) => {
        const dialog = event.target.closest('dialog')
        if (event.target.closest('button')?.textContent.trim() === 'Fermer' &&
            dialog?.textContent.includes('Bienvenue sur cartes.gouv.fr')) clicks++
      })
    })

    cy.visit(Cypress.env('baseUrl'))
    cy.wrap(null, { timeout: 30000 }).should(() => expect(clicks).to.be.greaterThan(0))
    cy.contains('dialog[open]', 'Bienvenue sur cartes.gouv.fr').should('not.exist')
  })

  it('ferme chaque réapparition sans toucher aux autres fenêtres', () => {
    cy.visit(Cypress.env('baseUrl'))
    cy.document().then((doc) => {
      const welcome = doc.createElement('dialog')
      welcome.id = 'test-welcome'
      welcome.innerHTML = '<h2>Bienvenue sur cartes.gouv.fr</h2><button>Fermer</button>'
      welcome.querySelector('button').addEventListener('click', () => welcome.removeAttribute('open'))
      const other = doc.createElement('dialog')
      other.id = 'test-other'
      other.innerHTML = '<h2>Autre fenêtre</h2><button>Fermer</button>'
      other.setAttribute('open', '')
      welcome.setAttribute('open', '')
      doc.body.append(other, welcome)
    })
    cy.get('#test-welcome').should('not.have.attr', 'open')
    cy.get('#test-other').should('have.attr', 'open')

    cy.get('#test-welcome').then(($dialog) => $dialog.attr('open', ''))
    cy.get('#test-welcome').should('not.have.attr', 'open')
    cy.get('#test-other').should('have.attr', 'open')
  })
})
