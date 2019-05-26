import getRange from './../Range'

function render(html) {
  document.body.innerHTML = html.replace(/\s{2,}/g, '')
}

it('simple selection', () => {
  render('<p id="root">simple text</p>')
  const p_root = document.getElementById('root').firstChild
  expect(
    getRange(p_root, {
      commonAncestorContainer: p_root,
      startContainer: p_root,
      startOffset: 1,
      endContainer: p_root,
      endOffset: 3
    })
  ).toEqual({ start: 1, end: 3 })
})

it('two elements in a paragraph', () => {
  render(`
  <p id="start">
    abc<b>defg</b>hi<b id="end">jklmn</b>
  </p>`)
  const p_start = document.getElementById('start')
  const b_end = document.getElementById('end')
  expect(
    getRange(p_start, {
      commonAncestorContainer: p_start,
      startContainer: p_start.firstChild,
      startOffset: 2,
      endContainer: b_end.firstChild,
      endOffset: 5
    })
  ).toEqual({ start: 2, end: 14 })
})

it('find common ancestor', () => {
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
    getRange(null, {
      commonAncestorContainer: div,
      startContainer: p_first.firstChild,
      startOffset: 1,
      endContainer: p_second.lastChild,
      endOffset: 1
    })
  ).toEqual({ start: 1, end: 7 })
})

it('one root with different children', () => {
  render(`<p id="root">hello <strong id="start">world</strong></p>`)
  const p_root = document.getElementById('root')
  const strong_start = document.getElementById('start')
  expect(
    getRange(p_root, {
      commonAncestorContainer: strong_start.firstChild,
      startContainer: strong_start.firstChild,
      startOffset: 0,
      endContainer: strong_start.firstChild,
      endOffset: 5
    })
  ).toEqual({ start: 6, end: 11 })
})
