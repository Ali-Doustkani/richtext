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
  'haveHtml',
  { prevSubject: 'element' },
  (subject, html) => {
    cy.wrap(subject).should('have.html', html.replace(/\s{2,}/g, ''))
  }
)
