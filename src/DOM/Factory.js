import { el } from './Query'

const createNewEditor = decor =>
  el(decor && decor.parent ? decor.tag : 'p')
    .setAttributeFrom(decor)
    .editable()

const createNewImage = source =>
  el('img')
    .setAttribute('src', source)
    .style({
      'max-width': '100%'
    })

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

  const parentOf = decors => {
    const result = decors ? decors.find(x => x.parent) : undefined
    return result || { tag: 'p' }
  }

  const lastEditorOf = pe => {
    const lastElement = list[list.length - 1]
    if (lastElement && lastElement.element.tagName === pe.tag.toUpperCase()) {
      return lastElement
    }
  }

  const editorOf = item => {
    const pe = parentOf(item.decors)
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
    const setChild = decor =>
      (child = el(decor.tag)
        .setAttributeFrom(decor)
        .val(child))
    item.decors.filter(x => !x.parent && x.tag !== 'a').forEach(setChild)
    item.decors.filter(x => !x.parent && x.tag === 'a').forEach(setChild)
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

export { generateRenderModel, createNewEditor, createNewImage }
