it('apply link to a text', () => {
  cy.visit('/')
  cy.get('#editor>p')
    .type('HelloWorld')
    .highlightAll()
  cy.contains('Bold').click()
  cy.get('#editor>p>b').highlight(0, 5)
  cy.contains('Hyperlink').click()
  cy.get('input[data-testid="dialogue-input"]').type('link{enter}')
  cy.get('#editor').shouldHaveHtml(`
  <p contenteditable="true">
    <a href="https://link"><b>Hello</b></a>
    <b>World</b>
  </p>`)
})
