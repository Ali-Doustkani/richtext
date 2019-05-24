describe('styling text', () => {
  it('simple styling', () => {
    cy.visit('/')

    cy.get('#editor>p').type('hello world')
    cy.contains('Bold').click()

    cy.get('#editor').should(
      'have.html',
      '<p contenteditable="true">hello world</p>'
    )

    cy.get('#editor>p')
      .highlight(0, 5)
      .contains('Italic')
      .click()

    cy.get('#editor').should(
      'have.html',
      '<p contenteditable="true"><i>hello</i> world</p>'
    )

    cy.get('#editor>p')
      .highlightAll()
      .contains('Bold')
      .click()

    cy.get('#editor').should(
      'have.html',
      '<p contenteditable="true"><b><i>hello</i></b><b> world</b></p>'
    )
  })

  it('three different styles', () => {
    cy.visit('/')

    cy.get('#editor>p')
      .type('hello world')
      .highlight(0, 5)
      .contains('Italic')
      .click()

    cy.get('#editor>p>i')
      .highlight(0, 5)
      .contains('Bold')
      .click()

    cy.get('#editor>p>b>i')
      .highlight(0, 5)
      .contains('Custom Style')
      .click()

    cy.get('#editor').should(
      'have.html',
      '<p contenteditable="true"><span class="text-highlight"><b><i>hello</i></b></span> world</p>'
    )
  })

  it('enter after selecting a text', () => {
    cy.visit('/')
    cy.get('#editor>p')
      .type('hello world')
      .highlight(4, 6)
    cy.get('#editor>p').type('{enter}')
    cy.get('#editor>p')
      .eq(1)
      .type('of ')

    cy.get('#editor').should(
      'have.html',
      '<p contenteditable="true">hell</p><p contenteditable="true">of world</p>'
    )
  })

  it('enter multiple paragraphs', () => {
    cy.visit('/')
    cy.get('#editor>p').type('hello{enter}world')
    cy.get('#editor').should(
      'have.html',
      '<p contenteditable="true">hello</p><p contenteditable="true">world</p>'
    )

    cy.get('#editor>p')
      .highlight(0, 5)
      .contains('Bold')
      .click()

    cy.get('#editor>p>b').highlight(4, 4)

    cy.get('#editor>p')
      .eq(0)
      .type('{enter}')

    cy.get('#editor').should(
      'have.html',
      '<p contenteditable="true"><b>hell</b></p><p contenteditable="true"><b>o</b></p><p contenteditable="true">world</p>'
    )
  })
})
