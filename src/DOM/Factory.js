import { el } from './Query'

function createNewEditor(effect) {
  return el(effect && effect.parent ? effect.tag : 'p')
    .setAttributeFrom(effect)
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
    const result = effects ? effects.find(x => x.parent) : undefined
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
    let child = item.text
    const setChild = effect =>
      (child = el(effect.tag)
        .setAttributeFrom(effect)
        .val(child))
    item.effects.filter(x => !x.parent && x.tag !== 'a').forEach(setChild)
    item.effects.filter(x => !x.parent && x.tag === 'a').forEach(setChild)
    const editor = editorOf(item)
    if (mergeable(editor.lastChild(), child)) {
      child.moveChildrenTo(editor.lastChild())
    } else {
      editor.append(child)
    }
  })

  return { list, active }
}

function empty() {
  const p = createNewEditor()
  return { list: [p], active: p }
}

function mergeable(el1, el2) {
  const theSame = el.hasTheSameTag(el1, el2)
  if (theSame && el1.is('a')) {
    return el1.getAttribute('href') === el2.getAttribute('href')
  }
  return theSame
}

export { generateRenderModel, createNewEditor }
