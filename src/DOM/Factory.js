function createNewEditor(effect) {
  const tag = effect && effect.parent ? effect.tag : 'p'
  const editor = document.createElement(tag)
  if (effect && effect.className) {
    editor.className = effect.className
  }
  editor.contentEditable = true
  return editor
}

/**
 * Generates a list of elements with their contents that must be rendered in the richtext.
 * @param {object} model The style model.
 * @returns {object} The render model.
 */
function createRenderModel(model) {
  const list = []
  let active

  const setActive = (editor, item) => (active = item.active ? editor : active)

  const parentOf = effects => {
    const result = effects ? effects.filter(x => x.parent)[0] : undefined
    return result || { tag: 'p' }
  }

  const lastElementOf = pe => {
    const lastElement = list[list.length - 1]
    if (lastElement && lastElement.tagName === pe.tag.toUpperCase()) {
      return lastElement
    }
  }

  model.forEach(item => {
    const pe = parentOf(item.effects)
    let ret = lastElementOf(pe)
    if (!ret) {
      ret = createNewEditor(pe)
      list.push(ret)
    }
    setActive(ret, item)
    const cc = children(item)
    if (cc) {
      ret.appendChild(cc)
    }
  })

  return { list, active }
}

function children(item) {
  let element
  const notParentEffects = (item.effects || []).filter(x => !x.parent)
  if (notParentEffects.length) {
    element = item.text
    notParentEffects.forEach(effect => (element = el(effect).value(element)))
  } else {
    element = el(item.text)
  }
  return element
}

function el(option) {
  if (typeof option === 'string') {
    if (option === '') {
      return null
    }
    return document.createTextNode(option)
  }
  const element = document.createElement(option.tag)
  if (option.className) {
    element.setAttribute('class', option.className)
  }
  return {
    value: value => {
      value = typeof value === 'string' ? document.createTextNode(value) : value
      element.appendChild(value)
      return element
    }
  }
}

export { createRenderModel, createNewEditor }
