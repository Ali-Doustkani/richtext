import { create } from '../Richtext'
import { makeEditable } from '../editor'

jest.mock('../editor')

let editor, richtext
beforeEach(() => {
  editor = document.createElement('div')
  richtext = create(editor)
})

it('do not set content with empty', () => {
  richtext.setInnerHTML('')
  expect(makeEditable).not.toHaveBeenCalled()
})

it('set content with non-empty', () => {
  richtext.setInnerHTML('<p>Hello</p>')
  expect(editor.innerHTML).toBe('<p>Hello</p>')
  expect(makeEditable).toHaveBeenCalled()
})
