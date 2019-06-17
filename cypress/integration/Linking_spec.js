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

it('edit a link', () => {
  cy.visit('/')
  cy.get('#editor>p')
    .type('Hello World')
    .highlightAll()
  cy.contains('Hyperlink').click()
  cy.get('input[data-testid="dialogue-input"]').type('link1{enter}')
  cy.get('#editor a').click()
  cy.get('input[data-testid="dialogue-input"]')
    .should('have.value', 'https://link1')
    .type('...TEXT{esc}')

  cy.get('#editor a').click()
  cy.get('input[data-testid="dialogue-input"]').type('{backspace}2{enter}')
  cy.get('#editor').shouldHaveHtml(`
  <p contenteditable="true">
    <a href="https://link2">Hello World</a>
  </p>`)
})

it('delete a link', () => {
  cy.visit('/')
  cy.get('#editor>p')
    .type('Hello')
    .highlightAll()
  cy.contains('Hyperlink').click()
  cy.get('input[data-testid="dialogue-input"]').type('link{enter}')
  cy.get('#editor a').click()
  cy.contains('Delete').click()
  cy.get('#editor').should('have.html', '<p contenteditable="true">Hello</p>')
})
