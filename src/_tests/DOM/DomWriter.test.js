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

let richtext
let editor
beforeEach(() => {
  editor = document.createElement('p')
  richtext = document.createElement('article')
  richtext.appendChild(editor)
})

it('render simple text', () => {
  render(richtext, editor, [{ text: 'hello world', active: true }])
  expect(editor.innerHTML).toBe('hello world')
})

it('render two items with different effects', () => {
  render(richtext, editor, [
    { text: 'Hello', effects: [effects.highlight], active: true },
    { text: 'World', effects: [effects.bold], active: false }
  ])
  expect(editor.innerHTML).toBe(
    '<span class="text-highlight">Hello</span><b>World</b>'
  )
})

it('render two items with some similar effects', () => {
  render(richtext, editor, [
    {
      text: 'Hello',
      effects: [effects.bold, effects.highlight],
      active: false
    },
    { text: 'World', effects: [effects.bold], active: true }
  ])
  expect(editor.innerHTML).toBe(
    '<span class="text-highlight"><b>Hello</b></span><b>World</b>'
  )
  expect(editor.tagName).toBe('P')
})

it('render parent tags when beginning with another el', () => {
  const active = render(richtext, editor, [
    { text: 'Title', effects: [effects.bigHeader, effects.bold], active: true },
    { text: 'Content', active: false }
  ])
  expect(richtext.children.length).toBe(2)
  expect(active.innerHTML).toBe('<b>Title</b>')
  expect(richtext.innerHTML).toBe('<h1><b>Title</b></h1><p>Content</p>')
})

it('render parent tags when ending with another el', () => {
  render(richtext, editor, [
    { text: 'Content', active: false },
    { text: 'Title', effects: [effects.smallHeader], active: true }
  ])
  expect(richtext.children.length).toBe(2)
  expect(richtext.innerHTML).toBe(
    '<p>Content</p><h2 class="header-style">Title</h2>'
  )
})

it('render parent tags when surrounded by paragraph', () => {
  render(richtext, editor, [
    { text: 'Content1', active: false },
    { text: 'Title', effects: [effects.bigHeader], active: false },
    { text: 'Content2', active: true }
  ])
  expect(richtext.children.length).toBe(3)
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

  render(richtext, editor, [{ text: 'Title', effects: [], active: true }])

  expect(richtext.innerHTML).toBe('<p>Content</p><p>Title</p><p>Content</p>')
})

it('render some part to header and then to paragraph again', () => {
  richtext.innerHTML = '<p>1</p><p>2</p><p>3</p>'
  editor = richtext.getElementsByTagName('p')[1]
  render(richtext, editor, [
    { text: '2', effects: [effects.bigHeader], active: true }
  ])
  expect(richtext.innerHTML).toBe('<p>1</p><h1>2</h1><p>3</p>')
})

it('render <pre> to <p> when its effect is absent', () => {
  richtext.innerHTML = '<pre><b>a bold text</b></pre>'
  editor = richtext.getElementsByTagName('pre')[0]
  render(richtext, editor, [
    { text: 'a bold text', effects: [effects.bold], active: true }
  ])
  expect(richtext.innerHTML).toBe('<p><b>a bold text</b></p>')
})

it('select the active editor when there is parent effect', () => {
  const model = [
    {
      text: 'Hello',
      effects: [effects.bigHeader],
      active: true
    },
    { text: 'World', effects: [effects.bold], active: false }
  ]
  let active = render(richtext, editor, model)
  expect(active.tagName).toBe('H1')

  model[0].active = false
  model[1].active = true
  active = render(richtext, editor, model)
  expect(active.tagName).toBe('P')
})

it('select the active editor from multiple non-parent effects', () => {
  const model = [
    { text: 'Hello', effects: [effects.bold], active: true },
    { text: 'World', effects: [effects.highlight], active: false }
  ]
  let active = render(richtext, editor, model)
  expect(active.tagName).toBe('P')

  model[0].active = false
  model[1].active = true
  active = render(richtext, editor, model)
  expect(active.tagName).toBe('P')
})
