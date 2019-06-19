import { el } from './Query'
import { createFigure } from './figure'

const renderImage = params => {
  let { richtext, editor, elements } = params
  elements = elements.map(e => (e.is('img') ? createFigure(e) : e))
  if (isPImgP(elements)) {
    renderPImgP(richtext, editor, elements)
  } else if (isLiImgLi(elements)) {
    renderLiImgLi(richtext, editor, elements)
  } else {
    addAll(richtext, elements)
  }
  return elements.find(x => x.is('figure'))
}

const isPImgP = elements =>
  elements.length === 3 &&
  elements[0].is('p') &&
  elements[1].is('figure') &&
  elements[2].is('p')

const renderPImgP = (richtext, editor, elements) =>
  richtext
    .insertBefore(editor, elements[0])
    .insertBefore(editor, elements[1])
    .insertBefore(editor, elements[2])
    .remove(editor)

const isLiImgLi = elements =>
  elements.length === 3 &&
  elements[0].is('li') &&
  elements[1].is('figure') &&
  elements[2].is('li')

const renderLiImgLi = (richtext, editor, elements) => {
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

const addAll = (richtext, elements) => richtext.append(elements)

export { renderImage }
