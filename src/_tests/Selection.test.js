import { JSDOM } from 'jsdom'
import { selectionPoints } from './../Selection'

function render(html) {
  html = html.replace(/\s{2,}/g, '')
  return new JSDOM(html)
}

beforeAll(() => {
  JSDOM.prototype.$ = function(id) {
    return this.window.document.getElementById(id)
  }
})

it('simple selection', () => {
  const dom = render('<p id="root">simple text</p>')
  const p_root = dom.$('root').firstChild
  expect(
    selectionPoints(p_root, {
      commonAncestorContainer: p_root,
      startContainer: p_root,
      startOffset: 1,
      endContainer: p_root,
      endOffset: 3
    })
  ).toEqual({ start: 1, end: 3 })
})

it('two elements in a paragraph', () => {
  const dom = render(`
  <p id="start">
    abc<b>defg</b>hi<b id="end">jklmn</b>
  </p>`)
  const p_start = dom.$('start')
  const b_end = dom.$('end')
  expect(
    selectionPoints(p_start, {
      commonAncestorContainer: p_start,
      startContainer: p_start.firstChild,
      startOffset: 2,
      endContainer: b_end.firstChild,
      endOffset: 5
    })
  ).toEqual({ start: 2, end: 14 })
})

it('find common ancestor', () => {
  const dom = render(`
  <div id="ancestor">
    <p id="first">ab<b><i>c</i></b>d</p>
    <div>
      <p id="second">e<strong>f</strong>ghij</p>
    </div>
  </div>`)
  const div = dom.$('ancestor')
  const p_first = dom.$('first')
  const p_second = dom.$('second')
  expect(
    selectionPoints(null, {
      commonAncestorContainer: div,
      startContainer: p_first.firstChild,
      startOffset: 1,
      endContainer: p_second.lastChild,
      endOffset: 1
    })
  ).toEqual({ start: 1, end: 7 })
})

it('one root with different children', () => {
  const dom = new JSDOM(
    `<p id="root">hello <strong id="start">world</strong></p>`
  )
  const p_root = dom.$('root')
  const strong_start = dom.$('start')
  expect(
    selectionPoints(p_root, {
      commonAncestorContainer: strong_start.firstChild,
      startContainer: strong_start.firstChild,
      startOffset: 0,
      endContainer: strong_start.firstChild,
      endOffset: 5
    })
  ).toEqual({ start: 6, end: 11 })
})
