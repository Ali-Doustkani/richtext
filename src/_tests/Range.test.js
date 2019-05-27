import { relativeRange, absoluteRange } from './../Range'

function render(html) {
  document.body.innerHTML = html.replace(/\s{2,}/g, '')
}

it('calculate relative range of an empty paragraph', () => {
  render('<p></p>')
  const p = document.getElementsByTagName('p')[0]
  expect(
    relativeRange(p, {
      commonAncestorContainer: p,
      startContainer: p,
      startOffset: 0,
      endContainer: p,
      endOffset: 0
    })
  ).toEqual({ start: 0, end: 0 })
})

it('calculate reletive range of a simple text selection', () => {
  render('<p>simple text</p>')
  const p_root = document.getElementsByTagName('p')[0].firstChild
  expect(
    relativeRange(p_root, {
      commonAncestorContainer: p_root,
      startContainer: p_root,
      startOffset: 1,
      endContainer: p_root,
      endOffset: 3
    })
  ).toEqual({ start: 1, end: 3 })
})

it('calculate reletive range of two elements in a paragraph', () => {
  render(`
  <p id="start">
    abc<b>defg</b>hi<b id="end">jklmn</b>
  </p>`)
  const p_start = document.getElementById('start')
  const b_end = document.getElementById('end')
  expect(
    relativeRange(p_start, {
      commonAncestorContainer: p_start,
      startContainer: p_start.firstChild,
      startOffset: 2,
      endContainer: b_end.firstChild,
      endOffset: 5
    })
  ).toEqual({ start: 2, end: 14 })
})

it('find common ancestor of relative range', () => {
  render(`
  <div id="ancestor">
    <p id="first">ab<b><i>c</i></b>d</p>
    <div>
      <p id="second">e<strong>f</strong>ghij</p>
    </div>
  </div>`)
  const div = document.getElementById('ancestor')
  const p_first = document.getElementById('first')
  const p_second = document.getElementById('second')
  expect(
    relativeRange(null, {
      commonAncestorContainer: div,
      startContainer: p_first.firstChild,
      startOffset: 1,
      endContainer: p_second.lastChild,
      endOffset: 1
    })
  ).toEqual({ start: 1, end: 7 })
})

it('calculate reletive range of one root with different children', () => {
  render(`<p>hello <strong>world</strong></p>`)
  const p_root = document.getElementsByTagName('p')[0]
  const strong_start = document.getElementsByTagName('strong')[0]
  expect(
    relativeRange(p_root, {
      commonAncestorContainer: strong_start.firstChild,
      startContainer: strong_start.firstChild,
      startOffset: 0,
      endContainer: strong_start.firstChild,
      endOffset: 5
    })
  ).toEqual({ start: 6, end: 11 })
})

it('calculate reletive range of when container is empty', () => {
  render('<p></p>')
  const p_root = document.getElementsByTagName('p')[0]
  expect(
    relativeRange(p_root, {
      commonAncestorContainer: p_root,
      startContainer: p_root,
      startOffset: 0,
      endContainer: p_root,
      endOffset: 0
    })
  ).toEqual({ start: 0, end: 0 })
})

it('calculate reletive range without selection', () => {
  render('<p>Hello</p>')
  const p_root = document.getElementsByTagName('p')[0]
  expect(
    relativeRange(p_root, {
      commonAncestorContainer: p_root,
      startContainer: p_root.firstChild,
      startOffset: 4,
      endContainer: p_root.firstChild,
      endOffset: 4
    })
  ).toEqual({ start: 4, end: 4 })
})

it('calculate absolute range of an empty paragraph', () => {
  render('<p></p>')
  const p = document.getElementsByTagName('p')[0]
  expect(absoluteRange(p, { start: 10, end: 50 })).toEqual({
    startContainer: p,
    startOffset: 0,
    endContainer: p,
    endOffset: 0
  })
})

it('calculate absolute range on a simple tree', () => {
  render('<p>Hello World</p>')
  const p = document.getElementsByTagName('p')[0]
  expect(absoluteRange(p, { start: 6, end: 11 })).toEqual({
    startContainer: p.firstChild,
    startOffset: 6,
    endContainer: p.firstChild,
    endOffset: 11
  })
})

it.each`
  from | to   | target                                | startOffset | destination                             | endOffset
  ${0} | ${9} | ${'firstChild.firstChild.firstChild'} | ${0}        | ${'childNodes.4.firstChild.firstChild'} | ${2}
  ${1} | ${7} | ${'firstChild.firstChild.firstChild'} | ${1}        | ${'childNodes.3'}                       | ${2}
  ${2} | ${8} | ${'childNodes.1'}                     | ${1}        | ${'childNodes.4.firstChild.firstChild'} | ${1}
  ${7} | ${9} | ${'childNodes.3'}                     | ${2}        | ${'childNodes.4.firstChild.firstChild'} | ${2}
  ${1} | ${1} | ${'firstChild.firstChild.firstChild'} | ${1}        | ${'firstChild.firstChild.firstChild'}   | ${1}
`(
  'calculate absolute range on a complex tree',
  ({ from, to, target, startOffset, destination, endOffset }) => {
    render(`
  <p>
    <b>
      <i>1</i>
    </b>
    234
    <b>5</b>
    67
    <b>
      <i>89</i>
    </b>
  </p>`)
    const p = document.getElementsByTagName('p')[0]
    let startContainer = p,
      endContainer = p
    target.split('.').forEach(sec => (startContainer = startContainer[sec]))
    destination.split('.').forEach(sec => (endContainer = endContainer[sec]))
    expect(absoluteRange(p, { start: from, end: to })).toEqual({
      startContainer,
      startOffset,
      endContainer,
      endOffset
    })
  }
)
