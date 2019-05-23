import style from './Stylist/Stylist'
import createDomReader from './DOM/DomReader'
import { standardizeRules } from './DOM/utils'

function create(rules) {
  rules = standardizeRules(rules)
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
          const newP = p()
          editor.appendChild(newP)
          newP.focus()
        }
      },
      true
    )

    return {
      apply: (start, end, styleName) => {
        const currentParagraph = document.activeElement
        if (currentParagraph.parentElement !== editor) {
          return
        }
        render(
          currentParagraph,
          style({
            type: rules[styleName],
            input: createDomReader(rules)(currentParagraph),
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
    editor.appendChild(p())
  }
  if (editor.firstChild.nodeName !== 'P') {
    throw new Error('only <p> element is valid inside editor')
  }
}

function render(paragraph, model) {
  paragraph.innerHTML = ''
  model.forEach(item => {
    if (!item.effects) {
      paragraph.appendChild(el(item.text))
    } else {
      let element = item.text
      item.effects.forEach(effect => {
        element = el(effect).value(element)
      })
      paragraph.appendChild(element)
    }
  })
}

function el(option) {
  if (typeof option === 'string') {
    return document.createTextNode(option)
  }
  const element = document.createElement(option.tag)
  if (option.className) {
    element.setAttribute('class', option.className)
  }
  return {
    value: value => {
      if (typeof value === 'string') {
        element.innerText = value
      } else {
        element.appendChild(value)
      }
      return element
    }
  }
}

function p() {
  const paragraph = document.createElement('p')
  paragraph.contentEditable = true
  return paragraph
}

export default create
