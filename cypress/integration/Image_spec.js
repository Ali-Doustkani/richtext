it('add and remove images', () => {
  cy.visit('/')
  cy.mockImageDialog()
  cy.get('#editor>p')
    .type('FirstSecond')
    .highlight(5, 5)
  cy.contains('Image').click()
  cy.get('figcaption').should('have.focus')
  cy.get('#editor').shouldHaveHtml(
    `
  <p contenteditable="true">First</p>
  <figure>
    <img src="data:">
    <button>Remove</button>
    <figcaption contenteditable="true"></figcaption>
  </figure>
  <p contenteditable="true">Second</p>`,
    { removeStyle: true }
  )

  cy.get('#editor>figure>button')
    .invoke('show')
    .click()
  cy.get('#editor>p')
    .eq(0)
    .should('have.focus')
  cy.get('#editor').shouldHaveHtml(`
    <p contenteditable="true">First</p>
    <p contenteditable="true">Second</p>`)
})
