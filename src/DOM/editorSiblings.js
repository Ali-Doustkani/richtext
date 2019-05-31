/**
 * Creates a list of editors that can be rendered by order.
 * The 'original' item is the initial editor that user typed in.
 * @param {HTMLElement} richtext 
 * @param {HTMLElement} editor
 */
function renderListManager(richtext, editor) {
  const elements = []
  let original = editor
  let active = editor

  const setActive = (editor, item) => (active = item.active ? editor : active)

  const replaceOriginal = newEditor => {
    richtext.replaceChild(newEditor, editor)
    original = newEditor
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

  const editorShouldChange = effect =>
    (effect && editor.tagName !== effect.tag.toUpperCase()) ||
    (!effect && editor.tagName !== 'P')

  const getOrCreateEditor = item => {
    const parentEffect = item.effects
      ? item.effects.filter(x => x.parent)[0]
      : undefined
    if (editorShouldChange(parentEffect)) {
      const newEditor = makeEditor(parentEffect)
      replaceOriginal(newEditor)
      setActive(newEditor, item)
      return newEditor
    }

    const lastElement = elements[elements.length - 1]
    if (lastElement && lastElement.tagName === 'P') {
      setActive(lastElement, item)
      return lastElement
    }

    if (elements.some(x => x === editor)) {
      const newEditor = makeEditor()
      setActive(newEditor, item)
      return newEditor
    }

    elements.push(editor)
    setActive(editor, item)
    return editor
  }

  return {
    getActive: () => active,
    getOriginal: () => original,
    getRenderList: () => elements,
    getOrCreateEditor
  }
}

export default renderListManager
