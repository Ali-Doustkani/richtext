import { el } from './Query'

function createNewEditor(effect) {
  return el(effect && effect.parent ? effect.tag : 'p')
    .setClassFrom(effect)
    .isEditable()
}

/**
 * Generates a list of QueryElement with their contents that should be put into the richtext.
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
    if (lastElement && lastElement.element.tagName === pe.tag.toUpperCase()) {
      return lastElement
    }
  }

  const editorOf = item => {
    const pe = parentOf(item.effects)
    let editor = lastEditorOf(pe)
    if (!editor) {
      editor = createNewEditor(pe)
      list.push(editor)
    }
    setActive(editor, item)
    return editor
  }

  styleModel.forEach(item => {
    let children = item.text
    const nonParentEffects = (item.effects || []).filter(x => !x.parent)
    if (nonParentEffects.length) {
      nonParentEffects.forEach(
        effect =>
          (children = el(effect.tag)
            .setClassFrom(effect)
            .val(children))
      )
    }
    editorOf(item).append(children)
  })

  return { list, active }
}

function empty() {
  const p = createNewEditor()
  return { list: [p], active: p }
}

export { generateRenderModel, createNewEditor }
