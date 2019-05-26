import style from './Stylist/Stylist'
import createDomReader from './DOM/DomReader'
import relativeRange from './Range'
import { breakAt, glue } from './Stylist/Break'
import { standardizeRules } from './DOM/utils'
import { renderTo, createParagraph } from './DOM/DomWriter'

/**
 * It creates a configurator function based on the rules.
 * @param {object} rules Rules to configure the editor. Rules contain tags and classes that are used to decorate text in paragraphs.
 * @returns {Function} The function that configures the given <div> or <article> element as the editor.
 */
function create(rules) {
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
          handleBackspaceKey(readParagraph)
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
      }
    }
  }
}

function checkEditor(editor) {
  if (editor.contentEditable === true) {
    throw new Error('the contentEditable of <div> editor must be false')
  }
  if (!editor.children.length) {
    editor.appendChild(createParagraph())
  }
  if (editor.firstChild.nodeName !== 'P') {
    throw new Error('only <p> element is valid inside editor')
  }
}
 
function handleBackspaceKey(readParagraph) {
  const range = getRelativeRange()
  if (range.start !== 0 || range.start !== 0) {
    return
  }

  const prevParagarph = active().previousSibling
  if (prevParagarph === null) {
    return
  }

  const editor = active().parentNode
  const newModel = glue(readParagraph(prevParagarph), readParagraph(active()))
  editor.removeChild(active())
  editor.removeChild(prevParagarph)
  const newParagraph = createParagraph()
  renderTo(newParagraph, newModel)
  editor.appendChild(newParagraph)
  newParagraph.focus()
}

function handleEnterKey(readParagraph) {
  const [m1, m2] = breakAt(readParagraph(active()), getRelativeRange())
  renderTo(active(), m1)
  const newParagraph = createParagraph()
  renderTo(newParagraph, m2)
  document.activeElement.insertAdjacentElement('afterend', newParagraph)
  newParagraph.focus()
}

function active() {
  return document.activeElement
}

function getRelativeRange() {
  return relativeRange(active(), window.getSelection().getRangeAt(0))
}

export default create
