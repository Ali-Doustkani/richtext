import { el, renderText } from './DOM'
import { relativeRange } from './Ranging'
import { breakAt, glue } from './Stylist'
import * as Editor from './editor'

function enterKey(event, decors, richtext) {
  event.preventDefault() // prevent creating new lines in the same p element
  const editor = el.active()
  if (editor.is('figcaption')) {
    return
  }
  if (editor.is('pre') && !event.ctrlKey) {
    Editor.handlePreEnter(editor)
    return
  }
  if (editor.is('li') && event.ctrlKey) {
    const renderModel = breakAt(decors, editor)
    renderModel.list[1].to('p').editable()
    renderText({ richtext, editors: editor, elements: renderModel.list })
    renderModel.active.focus()
    return
  }
  const renderModel = breakAt(decors, editor)
  renderText({ richtext, editors: editor, elements: renderModel.list })
  renderModel.active.focus()
}

function backspaceKey(event, decors, richtext) {
  const editor = el.active()
  if (editor.is('figcaption')) {
    return
  }
  if (!Editor.canBackspace(editor)) {
    return
  }
  event.preventDefault()
  const prevEditor = Editor.previousEditor(editor)
  const len = prevEditor.textLength
  const renderModels = glue(decors, prevEditor, editor)
  renderText({
    richtext,
    editors: [prevEditor, editor],
    elements: renderModels.list
  })
  Editor.setCursor(renderModels.active, len)
}

function deleteKey(event, decors, richtext) {
  const editor = el.active()
  if (editor.is('figcaption')) {
    return
  }
  if (!Editor.canDelete(editor)) {
    return
  }
  event.preventDefault()

  const len = editor.textLength
  const nextEditor = Editor.nextEditor(editor)
  const renderModel = glue(decors, editor, nextEditor)
  renderText({
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
  const len = editor.textLength
  if (relRange.start === len && relRange.end === len) {
    event.preventDefault()
    Editor.focusNext(editor)
  }
}

export { enterKey, backspaceKey, deleteKey, arrowUp, arrowDown }
