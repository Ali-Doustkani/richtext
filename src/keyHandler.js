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
    const renderModel = breakAt(read(effects, editor), relativeRange(editor))
    renderModel.list[1].to('p').isEditable()
    render({ richtext, editors: editor, elements: renderModel.list })
    renderModel.active.element.focus()
    return
  }
  const renderModel = breakAt(read(effects, editor), relativeRange(editor))
  render({ richtext, editors: editor, elements: renderModel.list })
  renderModel.active.element.focus()
}

function backspaceKey(event, effects, richtext) {
  const editor = el.active()
  if (!Editor.canBackspace(editor)) {
    return
  }
  event.preventDefault()
  const prevEditor = Editor.previousEditor(editor)
  const len = prevEditor.length
  const renderModels = glue(read(effects, prevEditor), read(effects, editor))
  render({
    richtext,
    editors: [prevEditor, editor],
    elements: renderModels.list
  })
  Editor.setCursor(renderModels.active, len)
}

function deleteKey(event, effects, richtext) {
  const editor = el.active()
  if (!Editor.canDelete(editor)) {
    return
  }
  event.preventDefault()

  const len = editor.length
  const nextEditor = Editor.nextEditor(editor)
  const renderModel = glue(read(effects, editor), read(effects, nextEditor))
  render({
    richtext,
    editors: [editor, nextEditor],
    elements: renderModel.list
  })
  Editor.setCursor(renderModel.active, len)
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