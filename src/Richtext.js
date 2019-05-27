import style from './Stylist/Stylist'
import createDomReader from './DOM/DomReader'
import { relativeRange, absoluteRange } from './Range'
import { breakAt, glue } from './Stylist/Break'
import { standardizeRules } from './DOM/utils'
import { renderTo, createParagraph } from './DOM/DomWriter'

/**
 * It creates a configurator function based on the rules.
 * @param {object} rules Rules to configure the editor. Rules contain tags and classes that are used to decorate text in paragraphs.
 * @returns {Function} The function that configures the given <div> or <article> element as the editor.
 */
function create(rules) {
  let staySelected = false
  rules = standardizeRules(rules)
  const readParagraph = createDomReader(rules)

  return function(editor) {
    checkEditor(editor)

    editor.addEventListener(
      'keydown',
      e => {
        if (e.key === 'Enter') {
          e.preventDefault() // prevent creating new lines in the same p element
          handleEnterKey(readParagraph)
        } else if (e.key === 'Backspace') {
          handleBackspaceKey(e, readParagraph)
        } else if (e.key === 'Delete') {
          handleDeleteKey(e, readParagraph)
        }
      },
      true
    )

    editor.addEventListener(
      'keyup',
      e => {
        if (e.key === 'Enter') {
          e.stopPropagation()
        }
      },
      true
    )

    return {
      staySelected: value => (staySelected = value),
      apply: (start, end, styleName) => {
        if (active().parentElement !== editor) {
          return
        }
        renderTo(
          active(),
          style({
            type: rules[styleName],
            input: readParagraph(active()),
            from: start,
            to: end
          })
        )
        setPosition(staySelected ? start : end, end)
      }
    }
  }
}

function checkEditor(editor) {
  if (editor.contentEditable === true) {
    throw new Error('the contentEditable of <div> editor must be false')
  }
  if (!editor.children.length) {
    createParagraph().append(editor)
  }
  if (editor.firstChild.nodeName !== 'P') {
    throw new Error('only <p> element is valid inside editor')
  }
}

function handleBackspaceKey(event, readParagraph) {
  const range = getRelativeRange()
  if (range.start !== 0 || range.end !== 0) {
    return
  }

  const prevParagarph = active().previousSibling
  if (prevParagarph === null) {
    return
  }

  event.preventDefault()
  const len = prevParagarph.textContent.length
  const newModel = glue(readParagraph(prevParagarph), readParagraph(active()))
  createParagraph(newModel).replaceWith(active(), prevParagarph)
  setPosition(len)
}

function handleDeleteKey(event, readParagraph) {
  const range = getRelativeRange()
  const len = active().textContent.length
  if (range.start !== len || range.end !== len) {
    return
  }

  const nextParagraph = active().nextSibling
  if (nextParagraph === null) {
    return
  }

  event.preventDefault()
  const newModel = glue(readParagraph(active()), readParagraph(nextParagraph))
  createParagraph(newModel).replaceWith(active(), nextParagraph)
  setPosition(len)
}

function handleEnterKey(readParagraph) {
  const [m1, m2] = breakAt(readParagraph(active()), getRelativeRange())
  renderTo(active(), m1)
  createParagraph(m2).addAfter(active())
}

function setPosition(start, end) {
  end = end || start
  const points = absoluteRange(active(), { start, end })
  const range = document.createRange()
  range.setStart(points.startContainer, points.startOffset)
  range.setEnd(points.endContainer, points.endOffset)
  const sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)
}

function active() {
  return document.activeElement
}

function getRelativeRange() {
  return relativeRange(active(), window.getSelection().getRangeAt(0))
}

export default create
