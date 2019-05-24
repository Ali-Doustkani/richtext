import { renderTo } from './../../DOM/DomWriter'

const rules = {
  bold: {
    tag: 'b'
  },
  highlight: {
    tag: 'span',
    className: 'text-highlight'
  }
}

let paragraph
beforeEach(() => (paragraph = document.createElement('p')))

it('render simple text', () => {
  renderTo(paragraph, [{ text: 'hello world' }])
  expect(paragraph.innerHTML).toBe('hello world')
})

it('render two items with different effects', () => {
  renderTo(paragraph, [
    { text: 'Hello', effects: [rules.highlight] },
    { text: 'World', effects: [rules.bold] }
  ])
  expect(paragraph.innerHTML).toBe(
    '<span class="text-highlight">Hello</span><b>World</b>'
  )
})

it('render two items with some similar effects', () => {
  renderTo(paragraph, [
    { text: 'Hello', effects: [rules.bold, rules.highlight] },
    { text: 'World', effects: [rules.bold] }
  ])
  expect(paragraph.innerHTML).toBe(
    '<span class="text-highlight"><b>Hello</b></span><b>World</b>'
  )
})