import { el, read, render, relativeRange } from './DOM'
import { breakAt, glue } from './Stylist'
import * as Editor from './editor'

function enterKey(event, effects, richtext) {
  event.preventDefault() // prevent creating new lines in the same p element
  const editor = el.active()
  if (editor.is('pre') && !event.ctrlKey) {
    Editor.handlePreEnter(editor)
    return
  }
  if (editor.is('li') && event.ctrlKey) {
    const elements = breakAt(read(effects, editor), relativeRange(editor))
    elements.list[1].to('p').isEditable()
    render(richtext, editor, elements.list)
    elements.active.element.focus()
    return
  }
  const elements = breakAt(read(effects, editor), relativeRange(editor))
  render(richtext, editor, elements.list)
  elements.active.element.focus()
}

function backspaceKey(event, effects, richtext) {
  const editor = el.active()
  if (!Editor.canBackspace(editor)) {
    return
  }
  event.preventDefault()
  const prevEditor = Editor.previousEditor(editor)
  const len = prevEditor.length
  const elements = glue(read(effects, prevEditor), read(effects, editor))
  render(richtext, [prevEditor, editor], elements.list)
  Editor.setCursor(elements.active, len)
}

function deleteKey(event, effects, richtextQuery) {
  const editor = el.active()
  if (!Editor.canDelete(editor)) {
    return
  }
  event.preventDefault()

  const len = editor.length
  const nextEditor = Editor.nextEditor(editor)
  const elements = glue(read(effects, editor), read(effects, nextEditor))
  render(richtextQuery, [editor, nextEditor], elements.list)
  Editor.setCursor(elements.active, len)
}

function arrowUp(event) {
  const editor = el.active()
  const range = window.getSelection().getRangeAt(0)
  if (range.startOffset === 0 && range.endOffset === 0) {
    event.preventDefault()
    Editor.focusPrev(editor)
  }
}

function arrowDown(event) {
  const editor = el.active()
  const relRange = relativeRange(editor)
  const len = editor.length
  if (relRange.start === len && relRange.end === len) {
    event.preventDefault()
    Editor.focusNext(editor)
  }
}

export { enterKey, backspaceKey, deleteKey, arrowUp, arrowDown }
