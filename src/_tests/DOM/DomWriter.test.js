import render from './../../DOM/DomWriter'

const effects = {
  bold: {
    tag: 'b'
  },
  highlight: {
    tag: 'span',
    className: 'text-highlight'
  },
  bigHeader: {
    parent: true,
    tag: 'h1'
  },
  smallHeader: {
    parent: true,
    tag: 'h2',
    className: 'header-style'
  }
}

let editor
let richtext
beforeEach(() => {
  editor = document.createElement('p')
  richtext = document.createElement('article')
  richtext.appendChild(editor)
})

it('render simple text', () => {
  render(editor, [{ text: 'hello world' }])
  expect(editor.innerHTML).toBe('hello world')
})

it('render two items with different effects', () => {
  render(editor, [
    { text: 'Hello', effects: [effects.highlight] },
    { text: 'World', effects: [effects.bold] }
  ])
  expect(editor.innerHTML).toBe(
    '<span class="text-highlight">Hello</span><b>World</b>'
  )
})

it('render two items with some similar effects', () => {
  render(editor, [
    { text: 'Hello', effects: [effects.bold, effects.highlight] },
    { text: 'World', effects: [effects.bold] }
  ])
  expect(editor.innerHTML).toBe(
    '<span class="text-highlight"><b>Hello</b></span><b>World</b>'
  )
})

it('render parent tags when beginning with another el', () => {
  const newEditor = render(editor, [
    { text: 'Title', effects: [effects.bigHeader, effects.bold] },
    { text: 'Content' }
  ])
  expect(richtext.children.length).toBe(2)
  expect(newEditor.innerHTML).toBe('<b>Title</b>')
  expect(richtext.innerHTML).toBe('<h1><b>Title</b></h1><p>Content</p>')
})

it('render parent tags when ending with another el', () => {
  const newEditor = render(editor, [
    { text: 'Content' },
    { text: 'Title', effects: [effects.smallHeader] }
  ])
  expect(richtext.children.length).toBe(2)
  expect(editor.innerHTML).toBe('Content')
  expect(newEditor.innerHTML).toBe('Title')
  expect(richtext.innerHTML).toBe(
    '<p>Content</p><h2 class="header-style">Title</h2>'
  )
})

it('render parent tags when surrounded by paragraph', () => {
  const newEditor = render(editor, [
    { text: 'Content1' },
    { text: 'Title', effects: [effects.bigHeader] },
    { text: 'Content2' }
  ])
  expect(richtext.children.length).toBe(3)
  expect(editor.innerHTML).toBe('Content1')
  expect(newEditor.innerHTML).toBe('Title')
  expect(richtext.innerHTML).toBe(
    '<p>Content1</p><h1>Title</h1><p>Content2</p>'
  )
})

it('render a header back to a paragraph', () => {
  const p1 = document.createElement('p')
  p1.appendChild(document.createTextNode('Content'))
  editor = document.createElement('h1')
  editor.appendChild(document.createTextNode('Title'))
  const p2 = document.createElement('p')
  p2.appendChild(document.createTextNode('Content'))
  richtext = document.createElement('article')
  richtext.appendChild(p1)
  richtext.appendChild(editor)
  richtext.appendChild(p2)

  editor = render(editor, [{ text: 'Title', effects: [] }])
  expect(editor.innerHTML).toBe('Title')
  expect(richtext.innerHTML).toBe('<p>Content</p><p>Title</p><p>Content</p>')
})

it('render some part to header and then to paragraph again', () => {
  richtext.innerHTML = '<p>1</p><p>2</p><p>3</p>'
  editor = richtext.getElementsByTagName('p')[1]
  editor = render(editor, [{ text: '2', effects: [effects.bigHeader] }])
  expect(editor.innerHTML).toBe('2')
  expect(richtext.innerHTML).toBe('<p>1</p><h1>2</h1><p>3</p>')
})

it('render <pre> to <p> when its effect is absent', () => {
  richtext.innerHTML = '<pre><b>a bold text</b></pre>'
  editor = richtext.getElementsByTagName('pre')[0]
  editor = render(editor, [{ text: 'a bold text', effects: [effects.bold] }])
  expect(editor.tagName).toBe('P')
  expect(richtext.innerHTML).toBe('<p><b>a bold text</b></p>')
})
