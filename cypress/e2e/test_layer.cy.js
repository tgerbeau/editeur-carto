// Le picto est un toggle (aria-pressed) ; dans l'éditeur le panneau devient visible sans attribut `open`.
function openLayersList() {
  cy.get('[id^="GPshowLayersListPicto-"]').then(($picto) => {
    if ($picto.attr('aria-pressed') !== 'true') cy.wrap($picto).click()
  })
  cy.get('[id^="GPshowLayersListPicto-"]').should('have.attr', 'aria-pressed', 'true')
  cy.get('[id^="GPlayersList-"]').should('be.visible')
}

describe('Module Couche de données', () => {
  beforeEach(() => {
    cy.login()
    cy.openEditor()
    cy.createMap()
  })

  it('affiche le gestionnaire de couches avec ses actions', () => {
    openLayersList()

    cy.get('[id^="GPlayerSwitcher_ID_"]').should('have.length.at.least', 1)
    cy.get('#add-layer-layerswitcher').should('be.visible')

    cy.get('[id^="GPlayerSwitcher_ID_"]').each(($layer) => {
      cy.wrap($layer).find('[id^="GPremove_ID_"]').should('exist')
      cy.wrap($layer).find('[id^="GPvisibilityPicto_ID_"]').should('exist')
    })

    cy.get('.ol-viewport').should('be.visible')
  })

  it('masque puis réaffiche une couche', () => {
    openLayersList()
    cy.get('[id^="GPvisibilityPicto_ID_"]').first().as('eye')
    cy.get('@eye').should('have.attr', 'aria-pressed', 'true').click()
    cy.get('@eye').should('have.attr', 'aria-pressed', 'false').click()
    cy.get('@eye').should('have.attr', 'aria-pressed', 'true')
  })
})
