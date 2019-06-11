describe('styling', () => {
  it('create unordered lists', () => {
    cy.visit('/')
    cy.get('#editor>p').type('HelloWorld')
    cy.contains('List').click()
    cy.get('#editor').shouldHaveHtml(`
    <ul>
      <li contenteditable="true">HelloWorld</li>
    </ul>`)

    cy.get('#editor>ul>li')
      .highlight(5, 5)
      .type('{enter}')
    cy.get('#editor').shouldHaveHtml(`
    <ul>
      <li contenteditable="true">Hello</li>
      <li contenteditable="true">World</li>
    </ul>`)

    cy.get('#editor li')
      .eq(0)
      .highlight(0, 5)
    cy.contains('Bold').click()
    cy.get('#editor').shouldHaveHtml(`
    <ul>
      <li contenteditable="true"><b>Hello</b></li>
      <li contenteditable="true">World</li>
    </ul>`)
  })

  it('put <p> in the list', () => {
    cy.visit('/')
    cy.get('#editor>p').type('Hello{enter}')
    cy.get('#editor>p')
      .eq(1)
      .type('World')
    cy.get('#editor>p')
      .eq(0)
      .focus()
    cy.contains('List').click()
    cy.get('#editor').shouldHaveHtml(`
    <ul>
      <li contenteditable="true">Hello</li>
    </ul>
    <p contenteditable="true">World</p>`)

    cy.get('#editor>p').focus()
    cy.contains('List').click()
    cy.get('#editor').shouldHaveHtml(`
    <ul>
      <li contenteditable="true">Hello</li>
      <li contenteditable="true">World</li>
    </ul>`)

    cy.get('#editor>ul>li')
      .eq(0)
      .type('{ctrl}{enter}')
    cy.get('#editor>p').type('SecondWorld')
    cy.get('#editor').shouldHaveHtml(`
    <ul>
      <li contenteditable="true">Hello</li>
    </ul>
    <p contenteditable="true">SecondWorld</p>
    <ul>
      <li contenteditable="true">World</li>
    </ul>`)

    cy.contains('List').click()
    cy.get('#editor').shouldHaveHtml(`
    <ul>
      <li contenteditable="true">Hello</li>
      <li contenteditable="true">SecondWorld</li>
      <li contenteditable="true">World</li>
    </ul>`)
  })
})

describe('handling keys', () => {
  describe('handling backspace', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    it('handle two <li>', () => {
      cy.get('#editor>p').type('Hello')
      cy.contains('List').click()
      cy.get('#editor li').type('{enter}')
      cy.get('#editor li')
        .eq(1)
        .type('World{home}{backspace}')
      cy.get('#editor').shouldHaveHtml(`
      <ul>
        <li contenteditable="true">HelloWorld</li>
      </ul>`)
      cy.get('#editor>ul>li').shouldHavePosition(5)
    })

    it('handle <p> then <li>', () => {
      cy.get('#editor>p').type('Hello{enter}')
      cy.get('#editor>p')
        .eq(1)
        .type('World')
      cy.contains('List').click()
      cy.get('#editor li').type('{home}{backspace}')
      cy.get('#editor').shouldHaveHtml(
        `<p contenteditable="true">HelloWorld</p>`
      )
      cy.get('#editor>p').shouldHavePosition(5)
    })

    it('handle <li> then <p>', () => {
      cy.get('#editor>p').type('Hello{enter}')
      cy.get('#editor>p')
        .eq(0)
        .focus()
      cy.contains('List').click()
      cy.get('#editor>p').type('World{home}{backspace}')
      cy.get('#editor').shouldHaveHtml(
        '<ul><li contenteditable="true">HelloWorld</li></ul>'
      )
      cy.get('#editor li').shouldHavePosition(5)
    })
  })

  describe('handling delete', () => {
    beforeEach(() => cy.visit('/'))

    it('handle two <li>', () => {
      cy.contains('List').click()
      cy.get('#editor li').type('Hello{enter}')
      cy.get('#editor li')
        .eq(1)
        .type('World')
      cy.get('#editor li')
        .eq(0)
        .type('{end}{del}')
      cy.get('#editor').shouldHaveHtml(
        '<ul><li contenteditable="true">HelloWorld</li></ul>'
      )
      cy.get('#editor li').shouldHavePosition(5)
    })

    it('handle <p> then <li>', () => {
      cy.get('#editor>p').type('Hello{enter}')
      cy.contains('List').click()
      cy.get('#editor li').type('World')
      cy.get('#editor>p').type('{end}{del}')
      cy.get('#editor').shouldHaveHtml(
        '<p contenteditable="true">HelloWorld</p>'
      )
      cy.get('#editor>p').shouldHavePosition(5)
    })

    it('handle <li> then <p>', () => {
      cy.get('#editor>p').type('Hello{enter}')
      cy.get('#editor>p')
        .eq(0)
        .focus()
      cy.contains('List').click()
      cy.get('#editor>p').type('World')
      cy.get('#editor li').type('{end}{del}')
      cy.get('#editor').shouldHaveHtml(
        '<ul><li contenteditable="true">HelloWorld</li></ul>'
      )
      cy.get('#editor li').shouldHavePosition(5)
    })
  })

  it('handle arrow keys', () => {
    cy.visit('/')
    cy.get('#editor>p').type('1{enter}')
    cy.get('#editor>p')
      .eq(1)
      .type('2')
    cy.contains('List').click()
    cy.get('#editor li').type('{enter}')
    cy.get('#editor li')
      .eq(1)
      .type('3{enter}')
    cy.get('#editor li')
      .eq(2)
      .type('4')
    cy.contains('List').click()

    cy.focused().type('{uparrow}{uparrow}')
    cy.get('#editor li')
      .eq(1)
      .should('have.focus')

    cy.focused().type('{downarrow}')
    cy.get('#editor>p')
      .eq(1)
      .should('have.focus')

    cy.focused().type('{uparrow}{uparrow}{uparrow}')
    cy.get('#editor li')
      .eq(0)
      .should('have.focus')

    cy.focused().type('{uparrow}{uparrow}')
    cy.get('#editor>p')
      .eq(0)
      .should('have.focus')

    cy.focused().type('{downarrow}')
    cy.get('#editor li')
      .eq(0)
      .should('have.focus')
  })

  it('handle ctrl+enter', () => {
    cy.visit('/')
    cy.get('#editor>p').type('HelloWorld')
    cy.contains('List').click()
    cy.get('#editor li')
      .highlight(5, 5)
      .type('{ctrl}{enter}')
    cy.get('#editor').shouldHaveHtml(`
    <ul>
      <li contenteditable="true">Hello</li>
    </ul>
    <p contenteditable="true">World</p>`)
    cy.get('#editor>p').shouldHavePosition(0)
  })
})
