import { createRenderModel } from './../../DOM/Factory'

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

it('model simple text', () => {
  const model = createRenderModel([{ text: 'hello world', active: true }])
  expect(model.list.length).toBe(1)
  expect(model.active).toBe(model.list[0])
  expect(model.list[0].outerHTML).toBe('<p>hello world</p>')
})

it('model two items with different effects', () => {
  const model = createRenderModel([
    { text: 'Hello', effects: [effects.highlight], active: true },
    { text: 'World', effects: [effects.bold], active: false }
  ])
  expect(model.list.length).toBe(1)
  expect(model.list[0].outerHTML).toBe(
    '<p><span class="text-highlight">Hello</span><b>World</b></p>'
  )
})

it('model two items with some effects intersection', () => {
  const model = createRenderModel([
    {
      text: 'Hello',
      effects: [effects.bold, effects.highlight],
      active: false
    },
    { text: 'World', effects: [effects.bold], active: true }
  ])
  expect(model.list.length).toBe(1)
  expect(model.list[0].outerHTML).toBe(
    '<p><span class="text-highlight"><b>Hello</b></span><b>World</b></p>'
  )
  expect(model.active).toBe(model.list[0])
})

it('model parent effect beginning with paragraph', () => {
  const model = createRenderModel([
    { text: 'Title', effects: [effects.bigHeader, effects.bold], active: true },
    { text: 'Content', active: false }
  ])
  expect(model.list.length).toBe(2)
  expect(model.active).toBe(model.list[0])
  expect(model.list[0].innerHTML).toBe('<b>Title</b>')
  expect(model.list[1].innerHTML).toBe('Content')
  expect(model.active).toBe(model.list[0])
})

it('model parent effect ending with paragraph', () => {
  const model = createRenderModel([
    { text: 'Content', active: true },
    { text: 'Title', effects: [effects.smallHeader], active: false }
  ])
  expect(model.list.length).toBe(2)
  expect(model.list[0].outerHTML).toBe('<p>Content</p>')
  expect(model.list[1].outerHTML).toBe('<h2 class="header-style">Title</h2>')
  expect(model.active).toBe(model.list[0])
})

it('model parent effect surrounded by paragraphs', () => {
  const model = createRenderModel([
    { text: 'Content1', active: false },
    { text: 'Title', effects: [effects.bigHeader], active: false },
    { text: 'Content2', active: true }
  ])
  expect(model.list.length).toBe(3)
  expect(model.list[0].outerHTML).toBe('<p>Content1</p>')
  expect(model.list[1].outerHTML).toBe('<h1>Title</h1>')
  expect(model.list[2].outerHTML).toBe('<p>Content2</p>')
  expect(model.active).toBe(model.list[2])
})

it('model empty effects', () => {
  const model = createRenderModel([
    { text: 'Hello', active: true },
    { text: 'World', active: false }
  ])

  expect(model.list.length).toBe(1)
  expect(model.list[0].outerHTML).toBe('<p>HelloWorld</p>')
  expect(model.active).toBe(model.list[0])
})
