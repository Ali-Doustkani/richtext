import { generateRenderModel } from './../../DOM/Factory'

const effects = {
  bold: {
    tag: 'b'
  },
  italic: {
    tag: 'i'
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

it('model empty', () => {
  const model = generateRenderModel([])
  expect(model.list.length).toBe(1)
  expect(model.active).toBe(model.list[0])
  expect(model.list[0].element.outerHTML).toBe('<p></p>')
})

it('model empty paragraphs', () => {
  let model = generateRenderModel([{ text: '', effects: [] }])
  expect(model.list.length).toBe(1)

  model = generateRenderModel([{ text: '', effects: [effects.bold] }])
  expect(model.list[0].element.firstChild.firstChild).toBeNull()
})

it('model simple text', () => {
  const model = generateRenderModel([
    { text: 'hello world', effects: [], active: true }
  ])
  expect(model.list.length).toBe(1)
  expect(model.active).toBe(model.list[0])
  expect(model.list[0].element.outerHTML).toBe('<p>hello world</p>')
})

it('model two items with different effects', () => {
  const model = generateRenderModel([
    { text: 'Hello', effects: [effects.highlight], active: true },
    { text: 'World', effects: [effects.bold], active: false }
  ])
  expect(model.list.length).toBe(1)
  expect(model.list[0].element.outerHTML).toBe(
    '<p><span class="text-highlight">Hello</span><b>World</b></p>'
  )
})

it('model two items with some effects in common', () => {
  const model = generateRenderModel([
    {
      text: 'Hello',
      effects: [effects.bold, effects.highlight],
      active: false
    },
    { text: 'World', effects: [effects.bold], active: true }
  ])
  expect(model.list.length).toBe(1)
  expect(model.list[0].element.outerHTML).toBe(
    '<p><span class="text-highlight"><b>Hello</b></span><b>World</b></p>'
  )
  expect(model.active).toBe(model.list[0])
})

it('model parent effect beginning with paragraph', () => {
  const model = generateRenderModel([
    { text: 'Title', effects: [effects.bigHeader, effects.bold], active: true },
    { text: 'Content', effects: [], active: false }
  ])
  expect(model.list.length).toBe(2)
  expect(model.active).toBe(model.list[0])
  expect(model.list[0].element.innerHTML).toBe('<b>Title</b>')
  expect(model.list[1].element.innerHTML).toBe('Content')
  expect(model.active).toBe(model.list[0])
})

it('model parent effect ending with paragraph', () => {
  const model = generateRenderModel([
    { text: 'Content', effects: [], active: true },
    { text: 'Title', effects: [effects.smallHeader], active: false }
  ])
  expect(model.list.length).toBe(2)
  expect(model.list[0].element.outerHTML).toBe('<p>Content</p>')
  expect(model.list[1].element.outerHTML).toBe(
    '<h2 class="header-style">Title</h2>'
  )
  expect(model.active).toBe(model.list[0])
})

it('model parent effect surrounded by paragraphs', () => {
  const model = generateRenderModel([
    { text: 'Content1', effects: [], active: false },
    { text: 'Title', effects: [effects.bigHeader], active: false },
    { text: 'Content2', effects: [], active: true }
  ])
  expect(model.list.length).toBe(3)
  expect(model.list[0].element.outerHTML).toBe('<p>Content1</p>')
  expect(model.list[1].element.outerHTML).toBe('<h1>Title</h1>')
  expect(model.list[2].element.outerHTML).toBe('<p>Content2</p>')
  expect(model.active).toBe(model.list[2])
})

it('model empty effects', () => {
  const model = generateRenderModel([
    { text: 'Hello', effects: [], active: true },
    { text: 'World', effects: [], active: false }
  ])

  expect(model.list.length).toBe(1)
  expect(model.list[0].element.outerHTML).toBe('<p>HelloWorld</p>')
  expect(model.active).toBe(model.list[0])
})

it('model anchors', () => {
  const model = generateRenderModel([
    { text: 'Hello', effects: [{ tag: 'a', href: 'link' }] },
    { text: 'World', effects: [] }
  ])
  expect(model.list[0].element.outerHTML).toBe(
    '<p><a href="link">Hello</a>World</p>'
  )
})

it('merge anchors in a single node', () => {
  const model = generateRenderModel([
    { text: 'Hello', effects: [effects.bold, { tag: 'a', href: 'link' }] },
    { text: 'World', effects: [{ tag: 'a', href: 'link' }] }
  ])
  expect(model.list[0].element.innerHTML).toBe(
    '<a href="link"><b>Hello</b>World</a>'
  )
})

it('do not merge anchors with different hrefs', () => {
  const model = generateRenderModel([
    { text: 'Hello', effects: [effects.bold, { tag: 'a', href: 'link1' }] },
    { text: 'World', effects: [{ tag: 'a', href: 'link2' }] }
  ])
  expect(model.list[0].element.innerHTML).toBe(
    '<a href="link1"><b>Hello</b></a><a href="link2">World</a>'
  )
})

it('put the anchor the last wrapper', () => {
  const model = generateRenderModel([
    {
      text: 'Hello',
      effects: [effects.bold, { tag: 'a', href: 'link' }, effects.italic]
    },
    { text: 'World', effects: [{ tag: 'a', href: 'link' }, effects.highlight] }
  ])
  expect(model.list[0].element.innerHTML).toBe(
    '<a href="link"><i><b>Hello</b></i><span class="text-highlight">World</span></a>'
  )
})
