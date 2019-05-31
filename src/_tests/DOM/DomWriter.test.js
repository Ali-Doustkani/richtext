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

const control = { editor: null, richtext: null }
beforeEach(() => {
  control.editor = document.createElement('p')
  control.richtext = document.createElement('article')
  control.richtext.appendChild(control.editor)
})

it('render simple text', () => {
  render(control, [{ text: 'hello world' }])
  expect(control.editor.innerHTML).toBe('hello world')
})

it('render two items with different effects', () => {
  render(control, [
    { text: 'Hello', effects: [effects.highlight] },
    { text: 'World', effects: [effects.bold] }
  ])
  expect(control.editor.innerHTML).toBe(
    '<span class="text-highlight">Hello</span><b>World</b>'
  )
})

it('render two items with some similar effects', () => {
  render(control, [
    { text: 'Hello', effects: [effects.bold, effects.highlight] },
    { text: 'World', effects: [effects.bold] }
  ])
  expect(control.editor.innerHTML).toBe(
    '<span class="text-highlight"><b>Hello</b></span><b>World</b>'
  )
})

it('render parent tags when beginning with another el', () => {
  render(control, [
    { text: 'Title', effects: [effects.bigHeader, effects.bold] },
    { text: 'Content' }
  ])
  expect(control.richtext.children.length).toBe(2)
  expect(control.editor.innerHTML).toBe('Content')
  expect(control.richtext.innerHTML).toBe('<h1><b>Title</b></h1><p>Content</p>')
})

it('render parent tags when ending with another el', () => {
  render(control, [
    { text: 'Content' },
    { text: 'Title', effects: [effects.smallHeader] }
  ])
  expect(control.richtext.children.length).toBe(2)
  expect(control.editor.innerHTML).toBe('Title')
  expect(control.richtext.innerHTML).toBe(
    '<p>Content</p><h2 class="header-style">Title</h2>'
  )
})

it('render parent tags when surrounded by paragraph', () => {
  render(control, [
    { text: 'Content1' },
    { text: 'Title', effects: [effects.bigHeader] },
    { text: 'Content2' }
  ])
  expect(control.richtext.children.length).toBe(3)
  expect(control.editor.innerHTML).toBe('Content2')
  expect(control.richtext.innerHTML).toBe(
    '<p>Content1</p><h1>Title</h1><p>Content2</p>'
  )
})

it('render a header back to a paragraph', () => {
  const p1 = document.createElement('p')
  p1.appendChild(document.createTextNode('Content'))
  control.editor = document.createElement('h1')
  control.editor.appendChild(document.createTextNode('Title'))
  const p2 = document.createElement('p')
  p2.appendChild(document.createTextNode('Content'))
  control.richtext = document.createElement('article')
  control.richtext.appendChild(p1)
  control.richtext.appendChild(control.editor)
  control.richtext.appendChild(p2)

  render(control, [{ text: 'Title', effects: [] }])

  expect(control.editor.innerHTML).toBe('Title')
  expect(control.richtext.innerHTML).toBe(
    '<p>Content</p><p>Title</p><p>Content</p>'
  )
})

it('render some part to header and then to paragraph again', () => {
  control.richtext.innerHTML = '<p>1</p><p>2</p><p>3</p>'
  control.editor = control.richtext.getElementsByTagName('p')[1]
  render(control, [{ text: '2', effects: [effects.bigHeader] }])
  expect(control.editor.innerHTML).toBe('2')
  expect(control.richtext.innerHTML).toBe('<p>1</p><h1>2</h1><p>3</p>')
})

it('render <pre> to <p> when its effect is absent', () => {
  control.richtext.innerHTML = '<pre><b>a bold text</b></pre>'
  control.editor = control.richtext.getElementsByTagName('pre')[0]
  render(control, [{ text: 'a bold text', effects: [effects.bold] }])
  expect(control.editor.tagName).toBe('P')
  expect(control.richtext.innerHTML).toBe('<p><b>a bold text</b></p>')
})
