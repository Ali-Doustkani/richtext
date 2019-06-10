import { el } from './../../DOM/Query'
import { render } from './../../DOM/Renderer'

let richtext
let editor

beforeEach(() => {
  editor = el('p').val('Initial Value')
  richtext = el('div').append(editor)
})

it('render a lists', () => {
  const list = [el('p').val('Hey'), el('pre').val('Code')]
  const renderModel = {
    list,
    active: list[1]
  }
  const active = render(richtext, editor, renderModel)
  expect(active).toBe(renderModel.active)
  expect(richtext.element.innerHTML).toBe('<p>Hey</p><pre>Code</pre>')
})

it('render an array of editors', () => {
  const list = [el('strong').val('deleted')]
  const renderModel = { list, active: list[0] }
  const editors = [el('p').val('first'), el('p').val('second')]
  richtext.append(editors[0]).append(editors[1])
  const active = render(richtext, editors, renderModel)
  expect(active).toBe(list[0])
  expect(richtext.element.innerHTML).toBe(
    '<p>Initial Value</p><strong>deleted</strong>'
  )
})

it('throw error on empty list', () => {
  expect(() => render(richtext, editor)).toThrow()
  expect(() => render(richtext, editor, { list: [] })).toThrow()
})

it('render an array of model', () => {
  render(richtext, editor, [{ list: [el('p')] }, { list: [el('p')] }])
  expect(richtext.element.innerHTML).toBe('<p></p><p></p>')
})

it('wrap li items in ul', () => {
  render(richtext, editor, {
    list: [
      el('p'),
      el('li').val('First'),
      el('li').val('Second'),
      el('p'),
      el('li').val('First')
    ]
  })
  expect(richtext.element.innerHTML).toBe(
    '<p></p><ul><li>First</li><li>Second</li></ul><p></p><ul><li>First</li></ul>'
  )
})

it('render when editor is inside an UL', () => {
  editor = el('li').val('1')
  richtext = el('article').append(el('ul').append(editor))
  render(richtext, editor, {
    list: [el('li').val('Hello'), el('li').val('World')]
  })

  expect(richtext.element.innerHTML).toBe(
    '<ul><li>Hello</li><li>World</li></ul>'
  )
})

it('merge with prev list', () => {
  richtext = el('article')
    .append(el('ul').val(el('li').val('First')))
    .append(el('p').val('Second'))
  editor = richtext.firstChild().next()

  render(richtext, editor, { list: [el('li').val('Second')] })

  expect(richtext.element.innerHTML).toBe(
    '<ul><li>First</li><li>Second</li></ul>'
  )
})

it('merge with next list', () => {
  richtext = el('article')
    .append(el('p').val('First'))
    .append(el('ul').val(el('li').val('Second')))
  editor = richtext.firstChild()

  render(richtext, editor, { list: [el('li').val('First')] })

  expect(richtext.element.innerHTML).toBe(
    '<ul><li>First</li><li>Second</li></ul>'
  )
})

it('merge with prev & next lists', () => {
  richtext = el('article')
    .append(el('ul').val(el('li').val('First')))
    .append(el('p').val('Second'))
    .append(el('ul').val(el('li').val('Third')))
  editor = richtext.firstChild().next()

  render(richtext, editor, { list: [el('li').val('Second')] })

  expect(richtext.element.innerHTML).toBe(
    '<ul><li>First</li><li>Second</li><li>Third</li></ul>'
  )
})

it('surround lis', () => {
  render(richtext, editor, {
    list: [
      el('p'),
      el('li').val('First'),
      el('li').val('Second'),
      el('p'),
      el('li').val('First')
    ]
  })

  expect(richtext.element.innerHTML).toBe(
    '<p></p><ul><li>First</li><li>Second</li></ul><p></p><ul><li>First</li></ul>'
  )
})

it('surround beginning lis', () => {
  render(richtext, editor, {
    list: [el('li').val('Hello'), el('li').val('World'), el('p')]
  })

  expect(richtext.element.innerHTML).toBe(
    '<ul><li>Hello</li><li>World</li></ul><p></p>'
  )
})

it('surround ending lis', () => {
  render(richtext, editor, {
    list: [el('p'), el('li').val('Hello'), el('li').val('World')]
  })

  expect(richtext.element.innerHTML).toBe(
    '<p></p><ul><li>Hello</li><li>World</li></ul>'
  )
})

it('does not surround when there is no li', () => {
  render(richtext, editor, { list: [el('p'), el('strong')] })

  expect(richtext.element.innerHTML).toBe('<p></p><strong></strong>')
})

it('render p after li', () => {
  richtext = el('article')
    .append(el('ul').append(el('li').val('First')))
    .append(el('p').val('Third'))
  editor = richtext.firstChild().firstChild()

  render(richtext, editor, [
    { list: [el('li').val('First')] },
    { list: [el('p').val('Second')] }
  ])

  expect(richtext.element.innerHTML).toBe(
    '<ul><li>First</li></ul><p>Second</p><p>Third</p>'
  )
})

it('append a paragraph to a list', () => {
  richtext = el('article')
    .append(el('ul').append(el('li').val('1')))
    .append(el('p').val('2'))
  const editors = [richtext.firstChild(), richtext.firstChild().next()]

  render(richtext, editors, { list: [el('li').val('12')] })

  expect(richtext.element.innerHTML).toBe('<ul><li>12</li></ul>')
})
