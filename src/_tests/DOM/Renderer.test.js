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

it('throw error on empty list', () => {
  expect(() => render(richtext, editor)).toThrow()
  expect(() => render(richtext, editor, { list: [] })).toThrow()
})

it('render an empty list with a non-empty list', () => {
  render(richtext, editor, { list: [el('p')] }, { list: [el('p')] })
  expect(richtext.element.innerHTML).toBe('<p></p><p></p>')
})
