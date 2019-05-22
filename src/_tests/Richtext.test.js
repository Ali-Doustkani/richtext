import { JSDOM } from 'jsdom'
import { richtext, restore } from './../Richtext'
import style from './../Stylist/Stylist'

beforeEach(() => {
  richtext.init({
    bold: 'b',
    italic: 'i',
    highlight: {
      tag: 'div',
      className: 'text-highlight'
    }
  })
})

it('restore', () => {
  const paragraph = new JSDOM(
    '<p id="paragraph"><b><i>hello</i></b> <i>world</i></p>'
  )
  console.log(paragraph.window.document.firstChild)
  const model = restore(paragraph.window.document.getElementById('paragraph'))
  expect(model).toEqual([
    { text: 'hello', effects: [style.italic, style.bold] },
    { text: ' ' },
    { text: 'world', effects: [style.italic] }
  ])
})
