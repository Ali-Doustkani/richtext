import style from './Stylist/Stylist'

richedit.init = function(options) {
  const initObj = {}
  for (let prop in options) {
    if (typeof options[prop] === 'string') {
      initObj[prop] = { tag: options[prop] }
    } else {
      initObj[prop] = options[prop]
    }
    richedit[prop] = prop
  }
  style.init(initObj)
}

function richedit(editor) {
  return {
    apply: function(start, end, styleName) {
      render(
        editor,
        style({
          type: style[styleName],
          input: restore(editor),
          from: start,
          to: end
        })
      )
    }
  }
}

function restore(div) {
  const ret = []
  let node = div.firstChild
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
  throw new Error('Unsupported nodeName')
}

function render(editor, model) {
  editor.innerHTML = ''
  model.forEach(item => {
    if (!item.effects) {
      editor.appendChild(el(item.text))
    } else {
      let element = item.text
      item.effects.forEach(effect => {
        element = el(effect).value(element)
      })
      editor.appendChild(element)
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

export { restore, richedit }
