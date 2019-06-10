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
        render(richtext, editor, style(effects, 0, editor.length, styleName))
        Editor.setCursor(editor, editor.length, editor.length)
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
    const [m1, m2] = breakAt(read(effects, editor), relativeRange(editor))
    m2.list[0].to('p').isEditable()
    render(richtextQuery, editor, [m1, m2]).element.focus()
    return
  }
  render(
    richtextQuery,
    editor,
    breakAt(read(effects, editor), relativeRange(editor))
  ).element.focus()
}

function handleBackspaceKey(event, effects, richtextQuery) {
  const editor = el.active()
  if (!Editor.canBackspace(editor)) {
    return
  }
  event.preventDefault()
  const len = editor.previous().val().length
  let prevEditor = editor.previous()
  if (prevEditor.is('ul')) {
    prevEditor = prevEditor.lastChild()
  }
  const active = render(
    richtextQuery,
    [editor.previous(), editor],
    glue(read(effects, prevEditor), read(effects, editor))
  )
  Editor.setCursor(active, len)
}

function handleDeleteKey(event, effects, richtextQuery) {
  const editor = el.active()
  if (!Editor.canDelete(editor)) {
    return
  }
  const len = editor.length
  event.preventDefault()

  const active = render(
    richtextQuery,
    [editor, editor.next()],
    glue(read(effects, editor), read(effects, editor.next()))
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
  const relRange = relativeRange(editor)
  const len = editor.length
  if (relRange.start === len && relRange.end === len) {
    event.preventDefault()
    Editor.focusNext(editor)
  }
}

export default create
