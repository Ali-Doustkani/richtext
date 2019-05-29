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

let paragraph
let editor
beforeEach(() => {
  paragraph = document.createElement('p')
  editor = document.createElement('article')
  editor.appendChild(paragraph)
})

it('render simple text', () => {
  render(paragraph, [{ text: 'hello world' }])
  expect(paragraph.innerHTML).toBe('hello world')
})

it('render two items with different effects', () => {
  render(paragraph, [
    { text: 'Hello', effects: [effects.highlight] },
    { text: 'World', effects: [effects.bold] }
  ])
  expect(paragraph.innerHTML).toBe(
    '<span class="text-highlight">Hello</span><b>World</b>'
  )
})

it('render two items with some similar effects', () => {
  render(paragraph, [
    { text: 'Hello', effects: [effects.bold, effects.highlight] },
    { text: 'World', effects: [effects.bold] }
  ])
  expect(paragraph.innerHTML).toBe(
    '<span class="text-highlight"><b>Hello</b></span><b>World</b>'
  )
})

it('render parent tags when beginning with another el', () => {
  render(paragraph, [
    { text: 'Title', effects: [effects.bigHeader, effects.bold] },
    { text: 'Content' }
  ])
  expect(paragraph.innerHTML).toBe('Content')
  expect(editor.innerHTML).toBe('<h1><b>Title</b></h1><p>Content</p>')
})

it('render parent tags when ending with another el', () => {
  render(paragraph, [
    { text: 'Content' },
    { text: 'Title', effects: [effects.smallHeader] }
  ])
  expect(paragraph.innerHTML).toBe('Content')
  expect(editor.innerHTML).toBe(
    '<p>Content</p><h2 class="header-style">Title</h2>'
  )
})

it('render parent tags when surrounded by paragraph', () => {
  render(paragraph, [
    { text: 'Content1' },
    { text: 'Title', effects: [effects.bigHeader] },
    { text: 'Content2' }
  ])
  expect(paragraph.innerHTML).toBe('Content1')
  expect(editor.innerHTML).toBe('<p>Content1</p><h1>Title</h1><p>Content2</p>')
})
