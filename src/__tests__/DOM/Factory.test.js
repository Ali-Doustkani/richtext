import { generateRenderModel } from './../../DOM/Factory'

const D = {
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
  let model = generateRenderModel([{ text: '', decors: [] }])
  expect(model.list.length).toBe(1)

  model = generateRenderModel([{ text: '', decors: [D.bold] }])
  expect(model.list[0].element.firstChild.firstChild).toBeNull()
})

it('model simple text', () => {
  const model = generateRenderModel([
    { text: 'hello world', decors: [], active: true }
  ])
  expect(model.list.length).toBe(1)
  expect(model.active).toBe(model.list[0])
  expect(model.list[0].element.outerHTML).toBe('<p>hello world</p>')
})

it('model two items with different decors', () => {
  const model = generateRenderModel([
    { text: 'Hello', decors: [D.highlight], active: true },
    { text: 'World', decors: [D.bold], active: false }
  ])
  expect(model.list.length).toBe(1)
  expect(model.list[0].element.outerHTML).toBe(
    '<p><span class="text-highlight">Hello</span><b>World</b></p>'
  )
})

it('model two items with some decors in common', () => {
  const model = generateRenderModel([
    {
      text: 'Hello',
      decors: [D.bold, D.highlight],
      active: false
    },
    { text: 'World', decors: [D.bold], active: true }
  ])
  expect(model.list.length).toBe(1)
  expect(model.list[0].element.outerHTML).toBe(
    '<p><span class="text-highlight"><b>Hello</b></span><b>World</b></p>'
  )
  expect(model.active).toBe(model.list[0])
})

it('model parent decor beginning with paragraph', () => {
  const model = generateRenderModel([
    { text: 'Title', decors: [D.bigHeader, D.bold], active: true },
    { text: 'Content', decors: [], active: false }
  ])
  expect(model.list.length).toBe(2)
  expect(model.active).toBe(model.list[0])
  expect(model.list[0].element.innerHTML).toBe('<b>Title</b>')
  expect(model.list[1].element.innerHTML).toBe('Content')
  expect(model.active).toBe(model.list[0])
})

it('model parent decor ending with paragraph', () => {
  const model = generateRenderModel([
    { text: 'Content', decors: [], active: true },
    { text: 'Title', decors: [D.smallHeader], active: false }
  ])
  expect(model.list.length).toBe(2)
  expect(model.list[0].element.outerHTML).toBe('<p>Content</p>')
  expect(model.list[1].element.outerHTML).toBe(
    '<h2 class="header-style">Title</h2>'
  )
  expect(model.active).toBe(model.list[0])
})

it('model parent decor surrounded by paragraphs', () => {
  const model = generateRenderModel([
    { text: 'Content1', decors: [], active: false },
    { text: 'Title', decors: [D.bigHeader], active: false },
    { text: 'Content2', decors: [], active: true }
  ])
  expect(model.list.length).toBe(3)
  expect(model.list[0].element.outerHTML).toBe('<p>Content1</p>')
  expect(model.list[1].element.outerHTML).toBe('<h1>Title</h1>')
  expect(model.list[2].element.outerHTML).toBe('<p>Content2</p>')
  expect(model.active).toBe(model.list[2])
})

it('model empty decors', () => {
  const model = generateRenderModel([
    { text: 'Hello', decors: [], active: true },
    { text: 'World', decors: [], active: false }
  ])

  expect(model.list.length).toBe(1)
  expect(model.list[0].element.outerHTML).toBe('<p>HelloWorld</p>')
  expect(model.active).toBe(model.list[0])
})

it('model anchors', () => {
  const model = generateRenderModel([
    { text: 'Hello', decors: [{ tag: 'a', href: 'link' }] },
    { text: 'World', decors: [] }
  ])
  expect(model.list[0].element.outerHTML).toBe(
    '<p><a href="link">Hello</a>World</p>'
  )
})

it('merge anchors in a single node', () => {
  const model = generateRenderModel([
    { text: 'Hello', decors: [D.bold, { tag: 'a', href: 'link' }] },
    { text: 'World', decors: [{ tag: 'a', href: 'link' }] }
  ])
  expect(model.list[0].element.innerHTML).toBe(
    '<a href="link"><b>Hello</b>World</a>'
  )
})

it('do not merge anchors with different hrefs', () => {
  const model = generateRenderModel([
    { text: 'Hello', decors: [D.bold, { tag: 'a', href: 'link1' }] },
    { text: 'World', decors: [{ tag: 'a', href: 'link2' }] }
  ])
  expect(model.list[0].element.innerHTML).toBe(
    '<a href="link1"><b>Hello</b></a><a href="link2">World</a>'
  )
})

it('put the anchor the last wrapper', () => {
  const model = generateRenderModel([
    {
      text: 'Hello',
      decors: [D.bold, { tag: 'a', href: 'link' }, D.italic]
    },
    { text: 'World', decors: [{ tag: 'a', href: 'link' }, D.highlight] }
  ])
  expect(model.list[0].element.innerHTML).toBe(
    '<a href="link"><i><b>Hello</b></i><span class="text-highlight">World</span></a>'
  )
})
