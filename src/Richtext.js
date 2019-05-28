import { glue } from './Stylist/Break'
import { standardizeRules } from './DOM/utils'
import { toRichParagraph, createRichParagraph } from './RichParagraph'
import { relativeRange } from './Range'

/**
 * It creates a configurator function based on the rules.
 * @param {object} rules Rules to configure the editor. Rules contain tags and classes that are used to decorate text in paragraphs.
 * @returns {Function} The function that configures the given <div> or <article> element as the editor.
 */
function create(rules) {
  let staySelected = false
  rules = standardizeRules(rules)

  return function(editor) {
    checkEditor(rules, editor)
    const paragraph = () =>
      toRichParagraph(rules, editor, document.activeElement)

    editor.addEventListener(
      'keydown',
      e => {
        if (e.key === 'Enter') {
          handleEnterKey(e, paragraph())
        } else if (e.key === 'Backspace') {
          handleBackspaceKey(e, paragraph())
        } else if (e.key === 'Delete') {
          handleDeleteKey(e, paragraph())
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          handleArrowUp(e, paragraph())
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          handleArrowDown(e, paragraph())
        }
      },
      true
    )

    return {
      staySelected: value => (staySelected = value),
      apply: (start, end, styleName) =>
        paragraph()
          .style(styleName, start, end)
          .setPosition(staySelected ? start : end, end)
    }
  }
}

function checkEditor(rules, editor) {
  if (editor.contentEditable === true) {
    throw new Error('the contentEditable of <div> editor must be false')
  }
  if (!editor.children.length) {
    createRichParagraph(rules, editor).attach()
  }
  if (editor.firstChild.nodeName !== 'P') {
    throw new Error('only <p> element is valid inside editor')
  }
}

function handleEnterKey(event, p) {
  event.preventDefault() // prevent creating new lines in the same p element
  const [m1, m2] = p.break()
  p.render(m1)
    .create(m2)
    .addAfter(p)
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
  const relRange = relativeRange(p.paragraph(), range)
  if (relRange.start === p.length && relRange.end === p.length) {
    event.preventDefault()
    p.focusNext()
  }
}

export default create
