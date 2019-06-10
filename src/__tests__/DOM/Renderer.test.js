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
  render(richtext, editor, { list: [el('li').val('1'), el('li').val('2')] })

  expect(richtext.element.innerHTML).toBe('<ul><li>1</li><li>2</li></ul>')
})

it('put sibling list items in the same ul', () => {
  richtext = el('article')
    .append(el('ul').val(el('li').val('1')))
    .append(el('p').val('2'))
    .append(el('ul').val(el('li').val('3')))
  editor = richtext.firstChild().nextSibling()
  render(richtext, editor, { list: [el('li').val('2')] })

  expect(richtext.element.innerHTML).toBe(
    '<ul><li>1</li><li>2</li><li>3</li></ul>'
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
    list: [el('li').val('1'), el('li').val('2'), el('p')]
  })

  expect(richtext.element.innerHTML).toBe(
    '<ul><li>1</li><li>2</li></ul><p></p>'
  )
})

it('surround ending lis', () => {
  render(richtext, editor, {
    list: [el('p'), el('li').val('1'), el('li').val('2')]
  })

  expect(richtext.element.innerHTML).toBe(
    '<p></p><ul><li>1</li><li>2</li></ul>'
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

it('render a list to a paragraph', () => {
  richtext = el('article')
    .append(el('ul').append(el('li').val('1')))
    .append(el('p').val('2'))
  const editors = [richtext.firstChild(), richtext.firstChild().nextSibling()]
  
  render(richtext, editors, { list: [el('li').val('12')] })
  
  expect(richtext.element.innerHTML).toBe('<ul><li>12</li></ul>')
})
