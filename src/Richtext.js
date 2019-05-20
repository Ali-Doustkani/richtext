import style from './Stylist/Stylist'

richtext.init = function(options) {
  const initObj = {}
  for (let prop in options) {
    if (typeof options[prop] === 'string') {
      initObj[prop] = { tag: options[prop] }
    } else {
      initObj[prop] = options[prop]
    }
    richtext[prop] = prop
  }
  style.init(initObj)
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

function richtext(editor) {
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
          type: style[styleName],
          input: restore(currentParagraph),
          from: start,
          to: end
        })
      )
    }
  }
}

function restore(paragraph) {
  const ret = []
  let node = paragraph.firstChild
  while (node !== null) {
    ret.push(drillDown(node, []))
    node = node.nextSibling
  }
  return ret
}

function drillDown(node, effects) {
  if (node.nodeType === Node.ELEMENT_NODE) {
    effects.unshift(getType(node.nodeName))
    return drillDown(node.firstChild, effects)
  } else if (node.nodeType === Node.TEXT_NODE) {
    if (effects.length == 0) {
      return { text: node.textContent }
    }
    return { text: node.textContent, effects }
  }
}

function getType(nodeName) {
  for (let prop in style) {
    if (style[prop].tag && style[prop].tag.toUpperCase() === nodeName) {
      return style[prop]
    }
  }
  throw new Error('Unsupported nodeName: ' + nodeName)
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

export { restore, richtext }
