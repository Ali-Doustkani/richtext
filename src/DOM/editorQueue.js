/**
 * Any element that user can type in is called an editor.
 * A richtext element contains one or more editors.
 * This function creates a closure for managing a queue of editors.
 * @param {HTMLParagraphElement} editor The main paragraph (editor) which user was typing in
 */
function createEditorQueue(editor) {
  const elements = []
  let newEditor

  const add = e => {
    elements.push(e)
    return e
  }

  const editParentOf = item => {
    if (item.effects) {
      const parentEffect = extractEditorEffect(item.effects)
      if (parentEffect) {
        newEditor = makeEditor(parentEffect)
        editor.parentElement.replaceChild(newEditor, editor)
        editor = newEditor
        return add(newEditor)
      }
    }
    const lastElement = elements[elements.length - 1]
    if (lastElement && lastElement.tagName === 'P') {
      return lastElement
    } else {
      if (elements.some(x => x === editor)) {
        return add(makeEditor())
      }
      if (shouldConvertEditorToParagraph(editor, item)) {
        newEditor = makeEditor()
        editor.parentElement.replaceChild(newEditor, editor)
        editor = newEditor
        return add(newEditor)
      }
      return add(editor)
    }
  }

  return {
    editParentOf,
    getQueue: () => elements,
    createdEditor: () => newEditor,
    getParagraphIndex: () => elements.indexOf(editor)
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

function makeEditor(parentEffect) {
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

function shouldConvertEditorToParagraph(editor, item) {
  return editor.tagName !== 'P' && (!item.effects || !item.effects.length)
}

export default createEditorQueue
