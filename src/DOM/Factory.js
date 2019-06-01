import { el } from './Query'

function createNewEditor(effect) {
  const tag = effect && effect.parent ? effect.tag : 'p'
  return el(tag)
    .setClassFrom(effect)
    .isEditable()
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

  const setActive = (editor, item) =>
    (active = item.active ? editor.element : active)

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

  styleModel.forEach(item => {
    const pe = parentOf(item.effects)
    let editor = lastEditorOf(pe)
    if (!editor) {
      editor = createNewEditor(pe)
      list.push(editor)
    }
    setActive(editor, item)
    let children

    const notParentEffects = (item.effects || []).filter(x => !x.parent)
    if (notParentEffects.length) {
      children = item.text
      notParentEffects.forEach(
        effect => {
          children = el(effect.tag).setClassFrom(effect).val(children)
        }
      )
    editor.append(children)

    } else {
      editor.appendText(item.text)
    }
  })

  const a = list.map(x => x.element)  // return Wrapped Elements
  return { list: a, active }
}

function empty() {
  const p = createNewEditor()
  return { list: [p.element], active: p.element }
}

export { generateRenderModel, createNewEditor }
