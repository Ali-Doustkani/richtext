import style from './Stylist/Stylist'
import breakAt from './Stylist/Break'
import createDomReader from './DOM/DomReader'
import getRange from './Range'
import { standardizeRules } from './DOM/utils'
import { renderTo, createParagraph } from './DOM/DomWriter'

function create(rules) {
  rules = standardizeRules(rules)
  const readParagraph = createDomReader(rules)

  return function(editor) {
    checkEditor(editor)

    editor.addEventListener(
      'keydown',
      e => {
        if (e.key === 'Enter') {
          e.preventDefault()
        }
      },
      true
    )

    editor.addEventListener(
      'keyup',
      e => {
        if (e.key === 'Enter') {
          e.stopPropagation()
          const [m1, m2] = breakAt(
            readParagraph(active()),
            getRange(active(), window.getSelection().getRangeAt(0))
          )
          renderTo(active(), m1)
          const newParagraph = createParagraph()
          renderTo(newParagraph, m2)
          document.activeElement.insertAdjacentElement('afterend', newParagraph)
          newParagraph.focus()
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

function active() {
  return document.activeElement
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

export default create
