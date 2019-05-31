import siblingManager from './editorSiblings'

/**
 * Renders the model to the editor and creates new elements surround it if needed.
 * @param {HTMLElement} editor The current editor that user is typing in.
 * @param {object} model The style model generated by Stylist.
 * If it creates a new editor it will return it otherwise the original editor is returned.
 */
function render(theEditor, model) {
  const elements = []
  theEditor.editor.innerHTML = ''
  const getEditor = siblingManager(theEditor, elements)
  model.forEach(item => getEditor(item).appendChild(children(item)))
  generateSiblings(theEditor, elements)
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

function generateSiblings(theEditor, elements) {
  const mainElementIndex = elements.indexOf(theEditor.editor)
  for (let i = mainElementIndex; i > 0; i--) {
    theEditor.richtext.insertBefore(elements[i - 1], elements[i])
  }
  for (let i = mainElementIndex; i < elements.length - 1; i++) {
    theEditor.richtext.insertBefore(
      elements[i + 1],
      elements[i + 1].nextSibling
    )
  }
}

export default render
