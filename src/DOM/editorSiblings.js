/**
 * Any element that user can type in is called an editor.
 * A richtext element contains one or more editors.
 * This function creates a closure for managing a queue of editors.
 * @param {HTMLParagraphElement} editor The main paragraph (editor) which user was typing in
 */
function createEditorSiblings(theEditor, elements) {
  const replace = newEditor => {
    theEditor.richtext.replaceChild(newEditor, theEditor.editor)
    theEditor.editor = newEditor
  }

  const makeEditor = effect => {
    const tag = effect ? effect.tag : 'p'
    const editor = document.createElement(tag)
    if (effect && effect.className) {
      editor.className = effect.className
    }
    editor.contentEditable = true
    elements.push(editor)
    return editor
  }

  const editorHasToChange = pe =>
    (pe && theEditor.editor.tagName !== pe.tag.toUpperCase()) ||
    (!pe && theEditor.editor.tagName !== 'P')

  return function(item) {
    const parentEffect = item.effects
      ? item.effects.filter(x => x.parent)[0]
      : undefined
    if (editorHasToChange(parentEffect)) {
      const newEditor = makeEditor(parentEffect)
      replace(newEditor)
      return newEditor
    }

    const lastElement = elements[elements.length - 1]
    if (lastElement && lastElement.tagName === 'P') {
      return lastElement
    }

    if (elements.some(x => x === theEditor.editor)) {
      return makeEditor()
    }

    elements.push(theEditor.editor)
    return theEditor.editor
  }
}

export default createEditorSiblings
