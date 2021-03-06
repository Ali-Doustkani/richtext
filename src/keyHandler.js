import { el, renderText } from './DOM'
import { relativeRange } from './Ranging'
import { breakAt, glue } from './Stylist'
import * as Editor from './editor'

const RLM = String.fromCharCode(8207)
const SPACE = String.fromCharCode(160)

function keyHandler(richtext, decors) {
  return {
    keyDown: e => {
      if (e.key === 'Enter') {
        enterKey(e)
      } else if (e.key === 'Backspace') {
        backspaceKey(e)
      } else if (e.key === 'Delete') {
        deleteKey(e)
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        arrowUp(e)
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        arrowDown(e)
      }
    },
    keyUp: e => {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        const editor = el.active()
        removeBr(editor)
        removeCommands(editor)
      } else if (e.key === ' ' && e.ctrlKey) {
        const editor = el.active()
        const range = relativeRange(editor)
        editor.writeText(RLM + SPACE, range)
        Editor.setCursor(editor, range.append(2))
      }
    }
  }

  function enterKey(event) {
    event.preventDefault() // prevent creating new lines in the same p element
    const editor = el.active()
    if (editor.is('figcaption')) {
      return
    }
    if (editor.is('pre') && !event.ctrlKey) {
      Editor.handlePreEnter(editor)
      return
    }
    const renderModel = breakAt(decors, editor)
    if (event.ctrlKey) {
      renderModel.list[1].to('p').editable()
    }
    renderText({ richtext, editors: editor, elements: renderModel.list })
    renderModel.active.focus()
  }

  function backspaceKey(event) {
    const editor = el.active()
    if (editor.is('figcaption')) {
      return
    }
    removeBr(editor)
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

  function deleteKey(event) {
    const editor = el.active()
    if (editor.is('figcaption')) {
      return
    }
    removeBr(editor)
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
}

// this avoids Browser to create the same styles again
function removeCommands(editor) {
  if (editor.textLength !== 0) {
    return
  }
  const params = [
    'bold',
    'italic',
    'backColor',
    'foreColor',
    'formatBlock',
    'heading',
    'hiliteColor'
  ]
  params.forEach(x => document.execCommand(x))
}

// removes the <br/> from empty editor
function removeBr(editor) {
  const firstChild = editor.firstChild()
  if (firstChild && firstChild.is('br')) {
    firstChild.remove()
  }
}

export default keyHandler
