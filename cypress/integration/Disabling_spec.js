it('handles disabled richtext', () => {
  cy.visit('/')
  cy.get('#richtext>p').type('Something{enter}')
  cy.get('#richtext>p')
    .eq(1)
    .type('Else')
  cy.get('#disabled').click()
  cy.get('#richtext').shouldHaveHtml(
    '<p contenteditable="false">Something</p>' +
      '<p contenteditable="false">Else</p>'
  )
  cy.get('#richtext').should('have.class', 'disabled')

  cy.get('#disabled').click()
  cy.get('#richtext').shouldHaveHtml(
    '<p contenteditable="true">Something</p>' +
      '<p contenteditable="true">Else</p>'
  )
  cy.get('#richtext').should('not.have.class', 'disabled')
})
