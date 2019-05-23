import { JSDOM } from 'jsdom'
import createDomReader from './../../DOM/DomReader'

const rules = {
  bold: { tag: 'b' },
  italic: { tag: 'i' },
  highlight: {
    tag: 'div',
    className: 'text-highlight'
  }
}

it('restore', () => {
  const paragraph = new JSDOM(
    '<p id="p"><b><i>hello</i></b> <i>world</i></p>'
  ).window.document.getElementById('p')

  const model = createDomReader(rules)(paragraph, rules)

  expect(model).toEqual([
    { text: 'hello', effects: [rules.italic, rules.bold] },
    { text: ' ' },
    { text: 'world', effects: [rules.italic] }
  ])
})
