describe('styling text', () => {
  it('type and style so simple', () => {
    cy.visit('/')

    cy.get('#editor>p').type('HelloWorld')
    cy.contains('Bold').click()

    cy.get('#editor').shouldHaveHtml(`
    <p contenteditable="true">
      HelloWorld
    </p>
    `)

    cy.get('#editor>p').highlight(0, 5)
    cy.contains('Italic').click()

    cy.get('#editor').shouldHaveHtml(`
    <p contenteditable="true">
      <i>Hello</i>
      World
    </p>`)

    cy.get('#editor>p').highlightAll()
    cy.contains('Bold').click()

    cy.get('#editor').shouldHaveHtml(`
    <p contenteditable="true">
      <b><i>Hello</i></b>
      <b>World</b>
    </p>`)
  })

  it('check selection based on "Stay Selected" checkbox', () => {
    cy.visit('/')
    cy.get('[type="checkbox"]').uncheck()
    cy.get('#editor>p').type('HelloWorld')
    cy.get('#editor>p').highlight(0, 5)
    cy.contains('Bold').click()

    cy.get('#editor>p').shouldHaveRange({
      startContainer: el => el.firstChild.firstChild,
      startOffset: 5,
      endContainer: el => el.firstChild.firstChild,
      endOffset: 5
    })

    cy.get('[type="checkbox"]').check()
    cy.get('#editor>p').highlightAll()
    cy.contains('Bold').click()

    cy.get('#editor>p').shouldHaveRange({
      startContainer: el => el.firstChild.firstChild,
      startOffset: 0,
      endContainer: el => el.firstChild.firstChild,
      endOffset: 10
    })
  })

  it('apply different styles to the same text', () => {
    cy.visit('/')

    cy.get('#editor>p')
      .type('HelloWorld')
      .highlight(0, 5)
    cy.contains('Italic').click()

    cy.get('#editor>p>i').highlight(0, 5)
    cy.contains('Bold').click()

    cy.get('#editor>p>b>i').highlight(0, 5)
    cy.contains('Custom Style').click()

    cy.get('#editor').shouldHaveHtml(`
    <p contenteditable="true">
      <span class="text-highlight">
        <b><i>Hello</i></b>
      </span>
      World
    </p>`)
  })

  it('press {enter} after selecting some text', () => {
    cy.visit('/')
    cy.get('#editor>p')
      .type('HelloWorld')
      .highlight(4, 5)
      .type('{enter}Of')

    cy.get('#editor').shouldHaveHtml(`
    <p contenteditable="true">
      Hell
    </p>
    <p contenteditable="true">
      OfWorld
    </p>`)
  })

  it('press {enter} creates multiple paragraphs', () => {
    cy.visit('/')
    cy.get('#editor>p').type('Hello{enter}World')
    cy.get('#editor').shouldHaveHtml(`
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

    cy.get('#editor').shouldHaveHtml(`
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

  it('press {backspace} at the beginning of a paragraph', () => {
    cy.visit('/')
    cy.get('#editor>p').type('123{enter}456{enter}789')
    cy.get('#editor>p')
      .eq(1)
      .highlight(0, 3)
    cy.contains('Bold').click()
    cy.get('#editor>p')
      .eq(1)
      .type('{home}{backspace}')

    cy.get('#editor').shouldHaveHtml(`
      <p contenteditable="true">
        123<b>456</b>
      </p>
      <p contenteditable="true">
        789
      </p>
      `)
    cy.get('#editor>p')
      .eq(0)
      .shouldHaveRange({
        startContainer: el => el.firstChild,
        startOffset: 3,
        endContainer: el => el.firstChild,
        endOffset: 3
      })
  })

  it('press {delete} at the beginning of a paragraph', () => {
    cy.visit('/')
    cy.get('#editor>p').type('123{enter}456{enter}789')
    cy.get('#editor>p')
      .eq(1)
      .highlight(0, 3)
    cy.contains('Bold').click()
    cy.get('#editor>p')
      .eq(0)
      .type('{end}{del}')

    cy.get('#editor').shouldHaveHtml(`
      <p contenteditable="true">
        123<b>456</b>
      </p>
      <p contenteditable="true">
        789
      </p>`)

    cy.get('#editor>p')
      .eq(0)
      .shouldHaveRange({
        startContainer: el => el.firstChild,
        startOffset: 3,
        endContainer: el => el.firstChild,
        endOffset: 3
      })
  })
})
