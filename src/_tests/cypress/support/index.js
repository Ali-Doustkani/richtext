function highlight(startContainer, startOffset, endContainer, endOffset) {
  const document = startContainer.ownerDocument
  const range = document.createRange()
  range.setStart(startContainer, startOffset)
  range.setEnd(endContainer, endOffset)
  document.getSelection().removeAllRanges(range)
  document.getSelection().addRange(range)
}

Cypress.Commands.add(
  'highlight',
  { prevSubject: 'element' },
  (subject, start, end) => {
    const el = subject[0]
    highlight(el.firstChild, start, el.firstChild, end)
    return subject
  }
)

Cypress.Commands.add('highlightAll', { prevSubject: 'element' }, subject => {
  const el = subject[0]
  let firstChild = el.firstChild
  while (firstChild.firstChild !== null) {
    firstChild = firstChild.firstChild
  }
  let lastChild = el.lastChild
  while (lastChild.lastChild !== null) {
    lastChild = lastChild.lastChild
  }
  highlight(firstChild, 0, lastChild, lastChild.data.length)
  return subject
})

Cypress.Commands.add(
  'shouldHaveHtml',
  { prevSubject: 'element' },
  (subject, html) => {
    cy.wrap(subject).should('have.html', html.replace(/\s{2,}/g, ''))
  }
)

Cypress.Commands.add(
  'shouldHaveRange',
  { prevSubject: 'element' },
  (subject, expectedRange) => {
    const realRange = subject[0].ownerDocument.defaultView
      .getSelection()
      .getRangeAt(0)
    expect(realRange.startContainer).to.equal(
      expectedRange.startContainer(subject[0])
    )
    expect(realRange.startOffset).to.equal(expectedRange.startOffset)
    expect(realRange.endContainer).to.equal(
      expectedRange.endContainer(subject[0])
    )
    expect(realRange.endOffset).to.equal(expectedRange.endOffset)
    return subject
  }
)

Cypress.Commands.add(
  'shouldHavePosition',
  { prevSubject: 'element' },
  (subject, container, offset) => {
    const range = subject[0].ownerDocument.defaultView
      .getSelection()
      .getRangeAt(0)
    expect(range.startContainer).to.equal(container(subject[0]))
    expect(range.startOffset).to.equal(offset)
    expect(range.endContainer).to.equal(container(subject[0]))
    expect(range.endOffset).to.equal(offset)
    return subject
  }
)
