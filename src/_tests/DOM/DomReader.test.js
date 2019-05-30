import createDomReader from './../../DOM/DomReader'

const effects = {
  bold: { tag: 'b' },
  styledBold: { tag: 'b', className: 'bold-style' },
  italic: { tag: 'i' },
  highlight: {
    tag: 'div',
    className: 'text-highlight'
  },
  bigHeader: {
    tag: 'h1'
  },
  styledHeader: {
    tag: 'h1',
    className: 'header-style'
  }
}

const read = createDomReader(effects)

it('read from paragraph editors', () => {
  const editor = document.createElement('p')
  editor.innerHTML = '<b><i>hello</i></b> <i>world</i>'

  expect(read(editor)).toEqual([
    { text: 'hello', effects: [effects.italic, effects.bold] },
    { text: ' ' },
    { text: 'world', effects: [effects.italic] }
  ])
})

it('read from non paragraph editors', () => {
  const editor = document.createElement('h1')
  editor.innerHTML = 'Title'
  expect(read(editor)).toEqual([
    { text: 'Title', effects: [effects.bigHeader] }
  ])
})

it('take classNames into account for effect detection', () => {
  const editor = document.createElement('h1')
  editor.className = 'header-style'
  editor.innerHTML = '<b class="bold-style">Title</b>'
  expect(read(editor)).toEqual([
    { text: 'Title', effects: [effects.styledBold, effects.styledHeader] }
  ])
})

it('read empty', () => {
  const editor = document.createElement('p')
  expect(read(editor)).toEqual([{ text: '' }])

  editor.appendChild(document.createTextNode(''))
  expect(read(editor)).toEqual([{ text: '' }])
})

it('read empty with effects', () => {
  const editor = document.createElement('p')
  const inner = document.createElement('h1')
  inner.className = 'header-style'
  editor.appendChild(inner)
  expect(read(editor)).toEqual([{ text: '', effects: [effects.styledHeader] }])
})
