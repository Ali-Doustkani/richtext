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
