import { checkEffects, checkEditor } from './args'
import { el, read, render, relativeRange } from './DOM'
import { breakAt, glue, style } from './Stylist'
import * as Editor from './editor'

/**
 * It creates a configurator function based on the rules.
 * @param {object} effects Rules to configure the richtext. Rules contain tags and classes that are used to decorate text in editors(p, pre, div, h1, etc.).
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
        const active = render(
          richtext,
          el.active(),
          style(effects, start, end, styleName)
        )
        if (styleName === 'header') {
          start = 0
          end = active.val().length
        }
        Editor.setCursor(active, staySelected ? start : end, end)
      },

      make: styleName => {
        const editor = el.active()
        render(
          richtext,
          editor,
          style(effects, 0, editor.val().length, styleName)
        )
        Editor.setCursor(editor, editor.val().length, editor.val().length)
      }
    }
  }
}

function handleEnterKey(event, effects, richtextQuery) {
  event.preventDefault() // prevent creating new lines in the same p element
  const editor = el.active()
  if (editor.is('PRE') && !event.ctrlKey) {
    Editor.handlePreEnter(editor)
    return
  }
  render(
    richtextQuery,
    editor,
    breakAt(
      read(effects, editor),
      relativeRange(editor, window.getSelection().getRangeAt(0))
    )
  ).element.focus()
}

function handleBackspaceKey(event, effects, richtextQuery) {
  const editor = el.active()
  if (!Editor.canBackspace(editor)) {
    return
  }
  event.preventDefault()
  const len = editor.previousSibling().val().length
  const active = render(
    richtextQuery,
    [editor.previousSibling(), editor],
    glue(read(effects, editor.previousSibling()), read(effects, editor))
  )
  Editor.setCursor(active, len)
}

function handleDeleteKey(event, effects, richtextQuery) {
  const editor = el.active()
  if (!Editor.canDelete(editor)) {
    return
  }
  const len = editor.val().length
  event.preventDefault()

  const active = render(
    richtextQuery,
    [editor, editor.nextSibling()],
    glue(read(effects, editor), read(effects, editor.nextSibling()))
  )
  Editor.setCursor(active, len)
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
  const relRange = relativeRange(editor, window.getSelection().getRangeAt(0))
  const len = editor.val().length
  if (relRange.start === len && relRange.end === len) {
    event.preventDefault()
    Editor.focusNext(editor)
  }
}

export default create
