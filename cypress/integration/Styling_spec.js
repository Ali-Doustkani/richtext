describe('styling', () => {
  it('type and style so simple', () => {
    cy.visit('/')

    cy.get('#richtext>p').type('HelloWorld')
    cy.contains('Bold').click()

    cy.get('#richtext').shouldHaveHtml(`
      <p contenteditable="true">
        HelloWorld
      </p>
      `)

    cy.get('#richtext>p').highlight(0, 5)
    cy.contains('Italic').click()

    cy.get('#richtext').shouldHaveHtml(`
      <p contenteditable="true">
        <i>Hello</i>
        World
      </p>`)

    cy.get('#richtext>p').highlightAll()
    cy.contains('Bold').click()

    cy.get('#richtext').shouldHaveHtml(`
      <p contenteditable="true">
        <b>
          <i>Hello</i>
          World
        </b>
      </p>`)
  })

  it('check selection based on "Stay Selected" checkbox', () => {
    cy.visit('/')
    cy.get('[type="checkbox"]').uncheck()
    cy.get('#richtext>p').type('HelloWorld')
    cy.get('#richtext>p').highlight(0, 5)
    cy.contains('Bold').click()

    cy.get('#richtext>p>b').shouldHavePosition(5)

    cy.get('[type="checkbox"]').check()
    cy.get('#richtext>p').highlightAll()
    cy.contains('Bold').click()

    cy.get('#richtext>p').shouldHaveRange({
      startContainer: el => el.firstChild.firstChild,
      startOffset: 0,
      endContainer: el => el.firstChild.firstChild,
      endOffset: 10
    })

    cy.get('#richtext>p').type('{enter}')
    cy.get('#richtext>p')
      .eq(1)
      .type('HelloWorld')
      .highlight(5, 6)
    cy.contains('Header').click()
    cy.get('#richtext>h1').shouldHaveRange({
      startContainer: el => el.firstChild,
      startOffset: 0,
      endContainer: el => el.firstChild,
      endOffset: 1
    })
  })

  it('apply different styles to the same text', () => {
    cy.visit('/')

    cy.get('#richtext>p')
      .type('HelloWorld')
      .highlight(0, 5)
    cy.contains('Italic').click()

    cy.get('#richtext>p>i').highlight(0, 5)
    cy.contains('Bold').click()

    cy.get('#richtext>p>b>i').highlight(0, 5)
    cy.contains('Custom Style').click()

    cy.get('#richtext').shouldHaveHtml(`
      <p contenteditable="true">
        <span class="text-highlight">
          <b><i>Hello</i></b>
        </span>
        World
      </p>`)
  })

  it('apply header editor', () => {
    cy.visit('/')
    cy.get('#richtext>p')
      .type('ContentTitleContent')
      .highlight(7, 12)
    cy.contains('Header').click()

    cy.get('#richtext>h1')
      .eq(0)
      .should('have.focus')
      .should('have.class', 'header-style')
      .type('{uparrow}{uparrow}')

    cy.get('#richtext>p')
      .eq(0)
      .should('have.focus')
      .type('{rightarrow}')

    cy.get('#richtext>h1')
      .should('have.focus')
      .type('{downarrow}{downarrow}')

    cy.get('#richtext>p')
      .eq(1)
      .should('have.focus')
      .type('{leftarrow}')

    cy.get('#richtext>h1')
      .should('have.focus')
      .type('{rightarrow}')

    cy.get('#richtext>p')
      .eq(1)
      .should('have.focus')

    cy.get('#richtext>h1')
      .focus()
      .highlight(0, 5)
    cy.contains('Header').click()

    cy.get('#richtext>p').should($p => {
      expect($p).to.have.length(3)
      expect($p.eq(0)).to.have.text('Content')
      expect($p.eq(1)).to.have.text('Title')
      expect($p.eq(2)).to.have.text('Content')
    })
  })

  it('type code content inside of a pre element', () => {
    cy.visit('/')
    cy.get('#richtext>p')
      .type('const str = "Hello World!"')
      .highlightAll()
    cy.contains('Code Box').click()
    cy.get('#richtext>pre')
      .type('{enter}')
      .type('const hello = str.slice(0, 5)')
      .type('{enter}')
      .type('const world = str.slice(6)')
      .type('{uparrow}{uparrow}{home}')
      .type('{enter}{uparrow}')
      .type('// program beginning')
      .type('{downarrow}{end}{enter}')
      .type('// slice beginning')
      .should(
        'have.html',
        `// program beginning
const str = "Hello World!"
// slice beginning
const hello = str.slice(0, 5)
const world = str.slice(6)`
      )
      .type('{home}{ctrl}{enter}')
    cy.get('#richtext').should(
      'have.html',
      `<pre contenteditable="true">// program beginning
const str = "Hello World!"
</pre><pre contenteditable="true">// slice beginning
const hello = str.slice(0, 5)
const world = str.slice(6)</pre>`
    )
  })
})

describe('key handling', () => {
  it('handle enter key after selecting some text', () => {
    cy.visit('/')
    cy.get('#richtext>p')
      .type('HelloWorld')
      .highlight(4, 5)
      .type('{enter}Of')

    cy.get('#richtext').shouldHaveHtml(`
      <p contenteditable="true">
        Hell
      </p>
      <p contenteditable="true">
        OfWorld
      </p>`)
  })

  it('handle enter key for creating new paragraphs', () => {
    cy.visit('/')
    cy.get('#richtext>p').type('Hello{enter}World')
    cy.get('#richtext').shouldHaveHtml(`
      <p contenteditable="true">
        Hello
      </p>
      <p contenteditable="true">
        World
      </p>`)

    cy.get('#richtext>p').highlight(0, 5)
    cy.contains('Bold').click()

    cy.get('#richtext>p>b').highlight(4, 4)

    cy.get('#richtext>p')
      .eq(0)
      .type('{enter}')

    cy.get('#richtext').shouldHaveHtml(`
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

  it('handle backspace key at the beginning of a paragraph', () => {
    cy.visit('/')
    cy.get('#richtext>p')
      .eq(0)
      .type('123{enter}')
    cy.focused().type('456{enter}')
    cy.focused().type('789')
    cy.get('#richtext>p')
      .eq(1)
      .highlight(0, 3)
    cy.contains('Bold').click()
    cy.get('#richtext>p')
      .eq(1)
      .type('{home}{backspace}')

    cy.get('#richtext').shouldHaveHtml(`
        <p contenteditable="true">
          123<b>456</b>
        </p>
        <p contenteditable="true">
          789
        </p>
        `)
    cy.get('#richtext>p')
      .eq(0)
      .shouldHavePosition(3)
  })

  it('handle del key at the beginning of a paragraph', () => {
    cy.visit('/')
    cy.get('#richtext>p').type('123{enter}')
    cy.focused().type('456{enter}')
    cy.focused().type('789')
    cy.get('#richtext>p')
      .eq(1)
      .highlight(0, 3)
    cy.contains('Bold').click()
    cy.get('#richtext>p')
      .eq(0)
      .type('{end}{del}')

    cy.get('#richtext').shouldHaveHtml(`
        <p contenteditable="true">
          123<b>456</b>
        </p>
        <p contenteditable="true">
          789
        </p>`)

    cy.get('#richtext>p')
      .eq(0)
      .shouldHavePosition(3)
  })

  it('handle arrow keys between paragraphs', () => {
    cy.visit('/')
    cy.get('#richtext>p')
      .type('X'.repeat(90))
      .type('{enter}')
    cy.get('#richtext>p')
      .eq(1)
      .type('Y'.repeat(90))
      .type('{uparrow}')
      .should('have.focus')
      .type('{uparrow}{uparrow}')
      .should('not.have.focus')
    cy.get('#richtext>p')
      .eq(0)
      .should('have.focus')
      .shouldHavePosition(90)
      .type('{uparrow}')
      .type('{uparrow}')
      .should('have.focus')
      //  Arrow Down
      .type('{downarrow}')
      .should('have.focus')
      .type('{downarrow}')
      .should('not.have.focus')
    cy.get('#richtext>p')
      .eq(1)
      .should('have.focus')
      .type('{downarrow}{downarrow}')
      .should('have.focus')
      // Arrow Left
      .type('{uparrow}{home}')
      .should('have.focus')
      .type('{leftarrow}')
      .should('not.have.focus')
    cy.get('#richtext>p')
      .eq(0)
      .should('have.focus')
      .shouldHavePosition(90)
      // Arrow Right
      .type('{rightarrow}')
      .should('not.have.focus')
    cy.get('#richtext>p')
      .eq(1)
      .should('have.focus')
      .shouldHavePosition(0)
  })
})
