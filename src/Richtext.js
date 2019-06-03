import { render } from './DOM/Renderer'
import { standardizeRules } from './DOM/utils'
import { el } from './DOM/Query'
import * as preEditor from './preEditor'
import createService from './Facade'
import {
  canBackspace,
  canDelete,
  focusNext,
  focusPrev,
  setCursor
} from './editor'
import createDomReader from './DOM/DomReader'
import { relativeRange } from './Range'

/**
 * It creates a configurator function based on the rules.
 * @param {object} rules Rules to configure the richtext. Rules contain tags and classes that are used to decorate text in editors(p, pre, div, h1, etc.).
 * @returns {Function} The function that configures the given <div> or <article> element as the editor.
 */
function create(rules) {
  let staySelected = false
  rules = standardizeRules(rules)

  return function(richtext) {
    checkEditor(rules, richtext)
    const richtextQuery = el(richtext)

    const services = createService(rules)

    richtext.addEventListener(
      'keydown',
      e => {
        const editor = el(document.activeElement)
        const context = {
          render: model => render(richtextQuery, editor, model),
          render2: (editor, model) => render(richtextQuery, editor, model),
          services,
          rules,
          richtextQuery,
          editor
        }

        if (e.key === 'Enter') {
          handleEnterKey(e, context)
        } else if (e.key === 'Backspace') {
          handleBackspaceKey(e, context)
        } else if (e.key === 'Delete') {
          handleDeleteKey(e, context)
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          handleArrowUp(e, context)
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          handleArrowDown(e, context)
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

function checkEditor(rules, richtext) {
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

function handleEnterKey(event, { editor, services, render, rules }) {
  event.preventDefault() // prevent creating new lines in the same p element
  if (editor.is('PRE') && !event.ctrlKey) {
    preEditor.handleEnter(editor)
    return
  }
  render(
    services.breakAt(
      createDomReader(rules)(editor),
      relativeRange(editor, window.getSelection().getRangeAt(0))
    )
  ).element.focus()
}

function handleBackspaceKey(event, { services, render2, rules, editor }) {
  if (!canBackspace(editor)) {
    return
  }
  event.preventDefault()
  const read = createDomReader(rules)
  const len = editor.previousSibling().val().length
  const active = render2(
    [editor.previousSibling(), editor],
    services.glue(read(editor.previousSibling()), read(editor))
  )
  setCursor(active, len)
}

function handleDeleteKey(event, { services, render2, editor, rules }) {
  if (!canDelete(editor)) {
    return
  }
  const len = editor.val().length
  const read = createDomReader(rules)
  event.preventDefault()

  const active = render2(
    [editor, editor.nextSibling()],
    services.glue(read(editor), read(editor.nextSibling()))
  )
  setCursor(active, len)
}

function handleArrowUp(event, { editor }) {
  const range = window.getSelection().getRangeAt(0)
  if (range.startOffset === 0 && range.endOffset === 0) {
    event.preventDefault()
    focusPrev(editor)
  }
}

function handleArrowDown(event, { editor }) {
  const relRange = relativeRange(editor, window.getSelection().getRangeAt(0))
  const len = editor.val().length
  if (relRange.start === len && relRange.end === len) {
    event.preventDefault()
    focusNext(editor)
  }
}

export default create
