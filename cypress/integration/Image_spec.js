it('add and remove images', () => {
  cy.visit('/')
  cy.mockImageDialog()
  cy.get('#richtext>p')
    .type('FirstSecond')
    .highlight(5, 5)
  cy.contains('Image').click()
  cy.get('figcaption').should('have.focus')
  cy.get('#richtext').shouldHaveHtml(
    `
  <p contenteditable="true">First</p>
  <figure>
    <img src="data:" data-filename="image.jpeg">
    <button>Remove</button>
    <figcaption contenteditable="true"></figcaption>
  </figure>
  <p contenteditable="true">Second</p>`,
    { removeStyle: true }
  )

  cy.get('#richtext>figure>button')
    .invoke('show')
    .click()
  cy.get('#richtext>p')
    .eq(0)
    .should('have.focus')
  cy.get('#richtext').shouldHaveHtml(`
    <p contenteditable="true">First</p>
    <p contenteditable="true">Second</p>`)
})
