describe('styling text', () => {
  it('simple styling', () => {
    cy.visit('/')

    cy.get('#editor>p').type('HelloWorld')
    cy.contains('Bold').click()

    cy.get('#editor').haveHtml(`
    <p contenteditable="true">
      HelloWorld
    </p>
    `)

    cy.get('#editor>p').highlight(0, 5)
    cy.contains('Italic').click()

    cy.get('#editor').haveHtml(`
    <p contenteditable="true">
      <i>Hello</i>
      World
    </p>`)

    cy.get('#editor>p').highlightAll()
    cy.contains('Bold').click()

    cy.get('#editor').haveHtml(`
    <p contenteditable="true">
      <b><i>Hello</i></b>
      <b>World</b>
    </p>`)
  })

  it('three different styles', () => {
    cy.visit('/')

    cy.get('#editor>p')
      .type('HelloWorld')
      .highlight(0, 5)
    cy.contains('Italic').click()

    cy.get('#editor>p>i').highlight(0, 5)
    cy.contains('Bold').click()

    cy.get('#editor>p>b>i').highlight(0, 5)
    cy.contains('Custom Style').click()

    cy.get('#editor').haveHtml(`
    <p contenteditable="true">
      <span class="text-highlight">
        <b><i>Hello</i></b>
      </span>
      World
    </p>`)
  })

  it('enter after selecting a text', () => {
    cy.visit('/')
    cy.get('#editor>p')
      .type('HelloWorld')
      .highlight(4, 5)
      .type('{enter}Of')

    cy.get('#editor').haveHtml(`
    <p contenteditable="true">
      Hell
    </p>
    <p contenteditable="true">
      OfWorld
    </p>`)
  })

  it('enter multiple paragraphs', () => {
    cy.visit('/')
    cy.get('#editor>p').type('Hello{enter}World')
    cy.get('#editor').haveHtml(`
    <p contenteditable="true">
      Hello
    </p>
    <p contenteditable="true">
      World
    </p>`)

    cy.get('#editor>p').highlight(0, 5)
    cy.contains('Bold').click()

    cy.get('#editor>p>b').highlight(4, 4)

    cy.get('#editor>p')
      .eq(0)
      .type('{enter}')

    cy.get('#editor').haveHtml(`
    <p contenteditable="true">
      <b>Hell</b>
    </p>
    <p contenteditable="true">
      <b>o</b>
    </p>
    <p contenteditable="true">
      World
    </p>`)
  })

  it('backspace in the beginning of a paragraph', () => {
    cy.visit('/')
    cy.get('#editor>p').type('One{enter}TwoThree')
    cy.get('#editor>p')
      .eq(1)
      .highlight(3, 8)
    cy.contains('Bold').click()
    cy.get('#editor>p')
      .eq(1)
      .type('{home}1{backspace}{backspace}')

    cy.get('#editor').haveHtml(`
      <p contenteditable="true">
        OneTwo
        <b>Three</b>
      </p>
      `)
  })
})
