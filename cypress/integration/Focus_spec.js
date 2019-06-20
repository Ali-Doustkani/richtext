it('handle focus', () => {
  cy.visit('/')
  cy.get('#richtext>p')
    .should('have.focus')
    .type('Hello{enter}')
  cy.get('#richtext>p')
    .eq(0)
    .focus()

  cy.get('#richtext').click()
  cy.get('#richtext>p')
    .eq(1)
    .should('have.focus')
})
