import { standardizeRules } from './DOM/utils'
import { el, read, render, relativeRange } from './DOM'
import * as preEditor from './preEditor'
import createService from './Facade'
import {
  canBackspace,
  canDelete,
  focusNext,
  focusPrev,
  setCursor
} from './editor'

/**
 * It creates a configurator function based on the rules.
 * @param {object} effects Rules to configure the richtext. Rules contain tags and classes that are used to decorate text in editors(p, pre, div, h1, etc.).
 * @returns {Function} The function that configures the given <div> or <article> element as the editor.
 */
function create(effects) {
  let staySelected = false
  effects = standardizeRules(effects)

  return function(richtext) {
    checkEditor(richtext)
    const richtextQuery = el(richtext)
    const services = createService(effects)
    richtext.addEventListener(
      'keydown',
      e => {
        if (e.key === 'Enter') {
          handleEnterKey(e, effects, richtextQuery, services)
        } else if (e.key === 'Backspace') {
          handleBackspaceKey(e, effects, richtextQuery, services)
        } else if (e.key === 'Delete') {
          handleDeleteKey(e, effects, richtextQuery, services)
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
          richtextQuery,
          el(document.activeElement),
          services.style(start, end, styleName)
        )
        if (styleName === 'header') {
          start = 0
          end = active.val().length
        }
        setCursor(active, staySelected ? start : end, end)
      },

      make: styleName => {
        const editor = el(document.activeElement)
        render(
          richtextQuery,
          editor,
          services.style(0, editor.val().length, styleName)
        )
        setCursor(editor, editor.val().length, editor.val().length)
      }
    }
  }
}

function checkEditor(richtext) {
  if (richtext.tagName !== 'DIV' && richtext.tagName !== 'ARTICLE') {
    throw new Error('the richtext can only be a <div> or <article> element')
  }
  if (richtext.contentEditable === true) {
    throw new Error(
      `the contentEditable of <${richtext.tagName}> richtext must be false`
    )
  }
  if (!richtext.children.length) {
    el(richtext).append(el('p').isEditable())
  }
  if (richtext.firstChild.nodeName !== 'P') {
    throw new Error('only <p> element is valid inside richtext')
  }
}

function handleEnterKey(event, effects, richtextQuery, services) {
  event.preventDefault() // prevent creating new lines in the same p element
  const editor = el(document.activeElement)
  if (editor.is('PRE') && !event.ctrlKey) {
    preEditor.handleEnter(editor)
    return
  }
  render(
    richtextQuery,
    editor,
    services.breakAt(
      read(effects, editor),
      relativeRange(editor, window.getSelection().getRangeAt(0))
    )
  ).element.focus()
}

function handleBackspaceKey(event, effects, richtextQuery, services) {
  const editor = el(document.activeElement)
  if (!canBackspace(editor)) {
    return
  }
  event.preventDefault()
  const len = editor.previousSibling().val().length
  const active = render(
    richtextQuery,
    [editor.previousSibling(), editor],
    services.glue(read(effects, editor.previousSibling()), read(effects, editor))
  )
  setCursor(active, len)
}

function handleDeleteKey(event, effects, richtextQuery, services) {
  const editor = el(document.activeElement)
  if (!canDelete(editor)) {
    return
  }
  const len = editor.val().length
  event.preventDefault()

  const active = render(
    richtextQuery,
    [editor, editor.nextSibling()],
    services.glue(read(effects, editor), read(effects, editor.nextSibling()))
  )
  setCursor(active, len)
}

function handleArrowUp(event) {
  const editor = el(document.activeElement)
  const range = window.getSelection().getRangeAt(0)
  if (range.startOffset === 0 && range.endOffset === 0) {
    event.preventDefault()
    focusPrev(editor)
  }
}

function handleArrowDown(event) {
  const editor = el(document.activeElement)
  const relRange = relativeRange(editor, window.getSelection().getRangeAt(0))
  const len = editor.val().length
  if (relRange.start === len && relRange.end === len) {
    event.preventDefault()
    focusNext(editor)
  }
}

export default create
