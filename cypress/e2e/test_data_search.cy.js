describe('Recherche de données', () => {
  it('recherche BD TOPO et ouvre sa fiche', () => {
    const searchUrl = new URL('/rechercher-une-donnee/search', Cypress.env('baseUrl')).toString()
    const datasetPath = '/rechercher-une-donnee/dataset/IGNF_BD-TOPO'
    // Le placeholder dépend de la langue servie (« catalogue » / « catalog »).
    const searchInput = 'input[placeholder*="catalog" i]'

    cy.visit(searchUrl)
    cy.get(searchInput, { timeout: 30000 })
      .should('be.visible')
      .type('BD TOPO{enter}')

    cy.location('search', { timeout: 30000 }).should('include', 'q=BD')
    // Le lien de la fiche est relatif (href="dataset/…").
    cy.get('a[href$="dataset/IGNF_BD-TOPO"]', { timeout: 30000 })
      .should('be.visible')
      .and('contain.text', 'BD TOPO')
      .click()

    cy.location('pathname', { timeout: 30000 }).should('eq', datasetPath)
    cy.contains(
      'La BD TOPO® version 3.5 contient une description vectorielle 3D (structurée en objets) des éléments du territoire et de ses infrastructures, de précision métrique.',
      { timeout: 30000 },
    ).should('be.visible')
  })
})