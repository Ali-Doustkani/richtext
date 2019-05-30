import { glue } from './Stylist/Break'
import { standardizeRules } from './DOM/utils'
import { toRichEditor, createRichEditor } from './RichEditor'
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
    const editor = () => toRichEditor(rules, richtext, document.activeElement)

    richtext.addEventListener(
      'keydown',
      e => {
        if (e.key === 'Enter') {
          handleEnterKey(e, editor())
        } else if (e.key === 'Backspace') {
          handleBackspaceKey(e, editor())
        } else if (e.key === 'Delete') {
          handleDeleteKey(e, editor())
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          handleArrowUp(e, editor())
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          handleArrowDown(e, editor())
        }
      },
      true
    )

    return {
      staySelected: value => (staySelected = value),
      apply: (start, end, styleName) =>
        editor()
          .style(styleName, start, end)
          .setPosition(staySelected ? start : end, end)
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
    createRichEditor(rules, richtext).attach()
  }
  if (richtext.firstChild.nodeName !== 'P') {
    throw new Error('only <p> element is valid inside richtext')
  }
}

function handleEnterKey(event, p) {
  event.preventDefault() // prevent creating new lines in the same p element
  p.break()
}

function handleBackspaceKey(event, p) {
  if (!p.isCursorAtBeginning || p.isFirst) {
    return
  }
  event.preventDefault()
  const len = p.prev.length
  p.create(glue(p.prev.model, p.model))
    .replaceWith(p, p.prev)
    .setPosition(len)
}

function handleDeleteKey(event, p) {
  if (!p.isCursorAtEnd || p.isLast) {
    return
  }
  const len = p.length
  event.preventDefault()
  p.create(glue(p.model, p.next.model))
    .replaceWith(p, p.next)
    .setPosition(len)
}

function handleArrowUp(event, p) {
  const range = window.getSelection().getRangeAt(0)
  if (range.startOffset === 0 && range.endOffset === 0) {
    event.preventDefault()
    p.focusPrev()
  }
}

function handleArrowDown(event, p) {
  const range = window.getSelection().getRangeAt(0)
  const relRange = relativeRange(p.element(), range)
  if (relRange.start === p.length && relRange.end === p.length) {
    event.preventDefault()
    p.focusNext()
  }
}

export default create
