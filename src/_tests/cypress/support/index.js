Cypress.Commands.add(
    'highlight',
    { prevSubject: 'element' },
    (subject, start, end) => {
      const el = subject[0]
      const document = el.ownerDocument
      const range = document.createRange()
      range.setStart(el.firstChild, start)
      range.setEnd(el.firstChild, end)
      document.getSelection().removeAllRanges(range)
      document.getSelection().addRange(range)
    }
  )
  
  Cypress.Commands.add('highlightAll', { prevSubject: 'element' }, subject => {
    const el = subject[0]
    const doc = el.ownerDocument
    const range = doc.createRange()
    console.log(el)
    range.setStart(el.firstChild.firstChild, 0)
    range.setEnd(el.lastChild, 6)
    doc.getSelection().removeAllRanges()
    doc.getSelection().addRange(range)
  })
  