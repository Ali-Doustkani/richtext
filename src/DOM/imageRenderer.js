import { el } from './Query'

function renderImage(params) {
  let { richtext, editor, elements } = params
  elements = elements.map(wrap)
  if (isPImgP(elements)) {
    renderPImgP(richtext, editor, elements)
  } else if (isLiImgLi(elements)) {
    renderLiImgLi(richtext, editor, elements)
  } else {
    addSingleImage(richtext, elements)
  }
}

function isPImgP(elements) {
  return (
    elements.length === 3 &&
    elements[0].is('p') &&
    elements[1].is('figure') &&
    elements[2].is('p')
  )
}

function renderPImgP(richtext, editor, elements) {
  richtext
    .insertBefore(editor, elements[0])
    .insertBefore(editor, elements[1])
    .insertBefore(editor, elements[2])
    .remove(editor)
}

function isLiImgLi(elements) {
  return (
    elements.length === 3 &&
    elements[0].is('li') &&
    elements[1].is('figure') &&
    elements[2].is('li')
  )
}

function renderLiImgLi(richtext, editor, elements) {
  const [li1, img, li2] = elements
  const list = editor.parent()
  const rest = list.removeFrom(editor).splice(1)
  list.append(li1)
  richtext.insertAfter(list, img)
  richtext.insertAfter(
    img,
    el
      .withTag(list)
      .append(li2)
      .append(rest)
  )
}

function addSingleImage(richtext, elements) {
  richtext.append(elements[0])
}

function wrap(element) {
  if (element.is('img')) {
    return el('figure')
      .append(element)
      .append(el('figcaption').isEditable())
  }
  return element
}

export { renderImage }
