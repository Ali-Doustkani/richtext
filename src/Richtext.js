import { checkEffects, checkEditor } from './args'
import { el, read, render, relativeRange } from './DOM'
import { breakAt, glue, style } from './Stylist'
import * as Editor from './editor'

/**
 * It creates a configurator function based on the effects.
 * @param {object} effects Effects to configure the richtext. Effects contain tags and classes that are used to decorate text in editors(p, pre, div, h1, etc.).
 * @returns {Function} The function that configures the given <div> or <article> element as the editor.
 */
function create(effects) {
  let staySelected = false
  effects = checkEffects(effects)

  return function(richtextElement) {
    checkEditor(richtextElement)
    const richtext = el(richtextElement)
    richtextElement.addEventListener(
      'keydown',
      e => {
        if (e.key === 'Enter') {
          handleEnterKey(e, effects, richtext)
        } else if (e.key === 'Backspace') {
          handleBackspaceKey(e, effects, richtext)
        } else if (e.key === 'Delete') {
          handleDeleteKey(e, effects, richtext)
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          handleArrowUp(e)
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          handleArrowDown(e)
        }
      },
      true
    )

    return {
      staySelected: value => (staySelected = value),

      apply: (start, end, styleName) => {
        const elements = style(effects, start, end, styleName)
        render(richtext, el.active(), elements.list)
        if (styleName === 'header') {
          start = 0
          end = elements.active.val().length
        }
        Editor.setCursor(elements.active, staySelected ? start : end, end)
      },

      make: styleName => {
        const editor = el.active()
        const elements = style(effects, 0, editor.length, styleName)
        render(richtext, editor, elements.list)
        Editor.setCursor(elements.active, editor.length, editor.length)
      }
    }
  }
}

function handleEnterKey(event, effects, richtextQuery) {
  event.preventDefault() // prevent creating new lines in the same p element
  const editor = el.active()
  if (editor.is('pre') && !event.ctrlKey) {
    Editor.handlePreEnter(editor)
    return
  }
  if (editor.is('li') && event.ctrlKey) {
    const elements = breakAt(read(effects, editor), relativeRange(editor))
    elements.list[1].to('p').isEditable()
    render(richtextQuery, editor, elements.list)
    elements.active.element.focus()
    return
  }
  const elements = breakAt(read(effects, editor), relativeRange(editor))
  render(richtextQuery, editor, elements.list)
  elements.active.element.focus()
}

function handleBackspaceKey(event, effects, richtextQuery) {
  const editor = el.active()
  if (!Editor.canBackspace(editor)) {
    return
  }
  event.preventDefault()
  const prevEditor = Editor.previousEditor(editor)
  const len = prevEditor.length
  const elements = glue(read(effects, prevEditor), read(effects, editor))
  render(richtextQuery, [prevEditor, editor], elements.list)
  Editor.setCursor(elements.active, len)
}

function handleDeleteKey(event, effects, richtextQuery) {
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

function handleArrowUp(event) {
  const editor = el.active()
  const range = window.getSelection().getRangeAt(0)
  if (range.startOffset === 0 && range.endOffset === 0) {
    event.preventDefault()
    Editor.focusPrev(editor)
  }
}

function handleArrowDown(event) {
  const editor = el.active()
  const relRange = relativeRange(editor)
  const len = editor.length
  if (relRange.start === len && relRange.end === len) {
    event.preventDefault()
    Editor.focusNext(editor)
  }
}

export default create
