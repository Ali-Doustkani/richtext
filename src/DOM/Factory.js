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
 * Generates a list of elements with their contents that should be put into the richtext.
 * It returns the list and the active element that should be focused.
 */
function generateRenderModel(styleModel) {
  if (!styleModel.length) {
    return empty()
  }

  const list = []
  let active

  const setActive = (editor, item) => (active = item.active ? editor : active)

  const parentOf = effects => {
    const result = effects ? effects.filter(x => x.parent)[0] : undefined
    return result || { tag: 'p' }
  }

  const lastEditorOf = pe => {
    const lastElement = list[list.length - 1]
    if (lastElement && lastElement.tagName === pe.tag.toUpperCase()) {
      return lastElement
    }
  }

  styleModel.forEach(item => {
    const pe = parentOf(item.effects)
    let editor = lastEditorOf(pe)
    if (!editor) {
      editor = createNewEditor(pe)
      list.push(editor)
    }
    setActive(editor, item)
    const children = createChildren(item)
    if (children) {
      editor.appendChild(children)
    }
  })

  return { list, active }
}

function empty() {
  const p = createNewEditor()
  return { list: [p], active: p }
}

function createChildren(item) {
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
  if (!option) {
    return null
  }
  if (typeof option === 'string') {
    return document.createTextNode(option)
  }
  const element = document.createElement(option.tag)
  if (option.className) {
    element.setAttribute('class', option.className)
  }
  return {
    value: value => {
      if (!value) {
        return element
      }
      value = typeof value === 'string' ? document.createTextNode(value) : value
      element.appendChild(value)
      return element
    }
  }
}

export { generateRenderModel, createNewEditor }
