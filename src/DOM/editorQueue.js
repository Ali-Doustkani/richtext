/**
 * Any element that user can type in is called an editor.
 * A richtext element contains one or more editors.
 * This function creates a closure for managing a queue of editors.
 * @param {HTMLParagraphElement} paragraph The main paragraph (editor) which user was typing in
 */
function createEditorQueue(paragraph) {
  const elements = []

  const add = e => {
    elements.push(e)
    return e
  }

  const editParentOf = item => {
    if (item.effects) {
      const parentEffect = extractEditorEffect(item.effects)
      if (parentEffect) {
        return add(createEditor(parentEffect))
      }
    }
    const lastElement = elements[elements.length - 1]
    if (lastElement && lastElement.tagName === 'P') {
      return lastElement
    } else {
      if (elements.some(x => x === paragraph)) {
        return add(createEditor())
      }
      return add(paragraph)
    }
  }

  const getQueue = () => elements

  const getParagraphIndex = () => elements.indexOf(paragraph)

  return {
    editParentOf,
    getQueue,
    getParagraphIndex
  }
}

function extractEditorEffect(effects) {
  let toRemove
  const parentEffect = effects.find((effect, i) => {
    if (effect.parent) {
      toRemove = i
      return true
    }
  })
  if (parentEffect) {
    effects.splice(toRemove, 1)
  }
  return parentEffect
}

function createEditor(parentEffect) {
  let editor
  if (parentEffect) {
    editor = document.createElement(parentEffect.tag)
    if (parentEffect.className) {
      editor.className = parentEffect.className
    }
  } else {
    editor = document.createElement('p')
  }
  editor.contentEditable = true
  return editor
}

export default createEditorQueue
