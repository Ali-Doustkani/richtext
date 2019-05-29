/**
 * Any element that user can type in is called an editor.
 * A richtext element contains one or more editors.
 * This function creates a closure for managing a queue of editors.
 * @param {HTMLParagraphElement} editor The main paragraph (editor) which user was typing in
 */
function createEditorSiblings(editor) {
  const elements = []
  let newEditor

  function add(e) {
    elements.push(e)
    return e
  }

  function replace(newEditor, oldEditor) {
    oldEditor.parentElement.replaceChild(newEditor, oldEditor)
    editor = newEditor
  }

  function getEditor(item) {
    const editorEffect = extractEditorEffect(item.effects)
    if (editorEffect) {
      newEditor = makeEditor(editorEffect)
      replace(newEditor, editor)
      return add(newEditor)
    }

    const lastElement = elements[elements.length - 1]
    if (lastElement && lastElement.tagName === 'P') {
      return lastElement
    }

    if (elements.some(x => x === editor)) {
      return add(makeEditor())
    }

    if (shouldConvertEditorToParagraph(editor, item)) {
      newEditor = makeEditor()
      replace(newEditor, editor)
      return add(newEditor)
    }

    return add(editor)
  }

  return {
    getEditor,
    siblings: () => elements,
    createdEditor: () => newEditor,
    mainElementIndex: () => elements.indexOf(editor)
  }
}

function extractEditorEffect(effects) {
  if (!effects) {
    return
  }
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

function makeEditor(effect) {
  let editor
  if (effect) {
    editor = document.createElement(effect.tag)
    if (effect.className) {
      editor.className = effect.className
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

export default createEditorSiblings
