describe('styling', () => {
  it('create <ul>', () => {
    cy.visit('/')
    cy.get('#richtext>p').type('HelloWorld')
    cy.contains('List').click()
    cy.get('#richtext').shouldHaveHtml(`
    <ul>
      <li contenteditable="true">HelloWorld</li>
    </ul>`)

    cy.get('#richtext>ul>li')
      .highlight(5, 5)
      .type('{enter}')
    cy.get('#richtext').shouldHaveHtml(`
    <ul>
      <li contenteditable="true">Hello</li>
      <li contenteditable="true">World</li>
    </ul>`)

    cy.get('#richtext li')
      .eq(0)
      .highlight(0, 5)
    cy.contains('Bold').click()
    cy.get('#richtext').shouldHaveHtml(`
    <ul>
      <li contenteditable="true"><b>Hello</b></li>
      <li contenteditable="true">World</li>
    </ul>`)
  })

  it('create <ol>', () => {
    cy.visit('/')
    cy.get('#richtext>p').type('One')
    cy.contains('Ordered List').click()
    cy.get('#richtext li').type('{enter}')
    cy.get('#richtext li')
      .eq(1)
      .type('Two')

    cy.get('#richtext').shouldHaveHtml(`
    <ol>
      <li contenteditable="true">One</li>
      <li contenteditable="true">Two</li>
    </ol>`)
  })

  it('put <p> in the list', () => {
    cy.visit('/')
    cy.get('#richtext>p').type('Hello{enter}')
    cy.get('#richtext>p')
      .eq(1)
      .type('World')
    cy.get('#richtext>p')
      .eq(0)
      .focus()
    cy.contains('List').click()
    cy.get('#richtext').shouldHaveHtml(`
    <ul>
      <li contenteditable="true">Hello</li>
    </ul>
    <p contenteditable="true">World</p>`)

    cy.get('#richtext>p').focus()
    cy.contains('List').click()
    cy.get('#richtext').shouldHaveHtml(`
    <ul>
      <li contenteditable="true">Hello</li>
      <li contenteditable="true">World</li>
    </ul>`)

    cy.get('#richtext>ul>li')
      .eq(0)
      .type('{ctrl}{enter}')
    cy.get('#richtext>p').type('SecondWorld')
    cy.get('#richtext').shouldHaveHtml(`
    <ul>
      <li contenteditable="true">Hello</li>
    </ul>
    <p contenteditable="true">SecondWorld</p>
    <ul>
      <li contenteditable="true">World</li>
    </ul>`)

    cy.contains('List').click()
    cy.get('#richtext').shouldHaveHtml(`
    <ul>
      <li contenteditable="true">Hello</li>
      <li contenteditable="true">SecondWorld</li>
      <li contenteditable="true">World</li>
    </ul>`)
  })

  it('convert <ol> to <ul>', () => {
    cy.visit('/')
    cy.get('#richtext>p').type('1')
    cy.contains('List').click()
    cy.get('#richtext').shouldHaveHtml(`
    <ul>
      <li contenteditable="true">1</li>
    </ul>`)

    cy.contains('Ordered List').click()
    cy.get('#richtext').shouldHaveHtml(`
    <ol>
      <li contenteditable="true">1</li>
    </ol>`)

    cy.contains('List').click()
    cy.get('#richtext li').type('{enter}')
    cy.get('#richtext li')
      .eq(1)
      .type('2{enter}')
    cy.get('#richtext li')
      .eq(2)
      .type('3')
    cy.get('#richtext li')
      .eq(1)
      .focus()
    cy.contains('Ordered List').click()
    cy.get('#richtext').shouldHaveHtml(`
    <ul>
      <li contenteditable="true">1</li>
    </ul>
    <ol>
      <li contenteditable="true">2</li>
    </ol>
    <ul>
      <li contenteditable="true">3</li>
    </ul>`)

    cy.get('#richtext>ol>li').focus()
    cy.contains('List').click()
    cy.get('#richtext').shouldHaveHtml(`
    <ul>
      <li contenteditable="true">1</li>
      <li contenteditable="true">2</li>
      <li contenteditable="true">3</li>
    </ul>`)
  })
})

describe('handling keys', () => {
  describe('handling backspace', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    it('handle two <li>', () => {
      cy.get('#richtext>p').type('Hello')
      cy.contains('List').click()
      cy.get('#richtext li').type('{enter}')
      cy.get('#richtext li')
        .eq(1)
        .type('World{home}{backspace}')
      cy.get('#richtext').shouldHaveHtml(`
      <ul>
        <li contenteditable="true">HelloWorld</li>
      </ul>`)
      cy.get('#richtext>ul>li').shouldHavePosition(5)
    })

    it('handle <p> then <li>', () => {
      cy.get('#richtext>p').type('Hello{enter}')
      cy.get('#richtext>p')
        .eq(1)
        .type('World')
      cy.contains('List').click()
      cy.get('#richtext li').type('{home}{backspace}')
      cy.get('#richtext').shouldHaveHtml(
        `<p contenteditable="true">HelloWorld</p>`
      )
      cy.get('#richtext>p').shouldHavePosition(5)
    })

    it('handle <li> then <p>', () => {
      cy.get('#richtext>p').type('Hello{enter}')
      cy.get('#richtext>p')
        .eq(0)
        .focus()
      cy.contains('List').click()
      cy.get('#richtext>p').type('World{home}{backspace}')
      cy.get('#richtext').shouldHaveHtml(
        '<ul><li contenteditable="true">HelloWorld</li></ul>'
      )
      cy.get('#richtext li').shouldHavePosition(5)
    })
  })

  describe('handling delete', () => {
    beforeEach(() => cy.visit('/'))

    it('handle two <li>', () => {
      cy.get('#richtext').click()
      cy.contains('List').click()
      cy.get('#richtext li').type('Hello{enter}')
      cy.get('#richtext li')
        .eq(1)
        .type('World')
      cy.get('#richtext li')
        .eq(0)
        .type('{end}{del}')
      cy.get('#richtext').shouldHaveHtml(
        '<ul><li contenteditable="true">HelloWorld</li></ul>'
      )
      cy.get('#richtext li').shouldHavePosition(5)
    })

    it('handle <p> then <li>', () => {
      cy.get('#richtext>p').type('Hello{enter}')
      cy.contains('List').click()
      cy.get('#richtext li').type('World')
      cy.get('#richtext>p').type('{end}{del}')
      cy.get('#richtext').shouldHaveHtml(
        '<p contenteditable="true">HelloWorld</p>'
      )
      cy.get('#richtext>p').shouldHavePosition(5)
    })

    it('handle <li> then <p>', () => {
      cy.get('#richtext>p').type('Hello{enter}')
      cy.get('#richtext>p')
        .eq(0)
        .focus()
      cy.contains('List').click()
      cy.get('#richtext>p').type('World')
      cy.get('#richtext li').type('{end}{del}')
      cy.get('#richtext').shouldHaveHtml(
        '<ul><li contenteditable="true">HelloWorld</li></ul>'
      )
      cy.get('#richtext li').shouldHavePosition(5)
    })
  })

  it('handle arrow keys', () => {
    cy.visit('/')
    cy.get('#richtext>p').type('1{enter}')
    cy.get('#richtext>p')
      .eq(1)
      .type('2')
    cy.contains('List').click()
    cy.get('#richtext li').type('{enter}')
    cy.get('#richtext li')
      .eq(1)
      .type('3{enter}')
    cy.get('#richtext li')
      .eq(2)
      .type('4')
    cy.contains('List').click()

    cy.focused().type('{uparrow}{uparrow}')
    cy.get('#richtext li')
      .eq(1)
      .should('have.focus')

    cy.focused().type('{downarrow}')
    cy.get('#richtext>p')
      .eq(1)
      .should('have.focus')

    cy.focused().type('{uparrow}{uparrow}{uparrow}')
    cy.get('#richtext li')
      .eq(0)
      .should('have.focus')

    cy.focused().type('{uparrow}{uparrow}')
    cy.get('#richtext>p')
      .eq(0)
      .should('have.focus')

    cy.focused().type('{downarrow}')
    cy.get('#richtext li')
      .eq(0)
      .should('have.focus')
  })

  it('handle ctrl+enter', () => {
    cy.visit('/')
    cy.get('#richtext>p').type('HelloWorld')
    cy.contains('List').click()
    cy.get('#richtext li')
      .highlight(5, 5)
      .type('{ctrl}{enter}')
    cy.get('#richtext').shouldHaveHtml(`
    <ul>
      <li contenteditable="true">Hello</li>
    </ul>
    <p contenteditable="true">World</p>`)
    cy.get('#richtext>p').shouldHavePosition(0)
  })
})
