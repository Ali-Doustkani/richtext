import { el } from './Query'
import { cond, unless, toArray } from './../Fns'

const renderText = params => {
  params.editors = toArray(params.editors)
  unless(
    cond([
      [shouldCreateList, createList],
      [shouldAppendOrDeleteListItem, appendOrDeleteListItem],
      [shouldChangeToSingle, changeToSingle],
      [shouldChangeToMultiple, changeToMultiple],
      [shouldChangeListType, changeListType],
      [shouldModifyListItem, modifyListItem]
    ]),
    addElements
  )(params)
}

const shouldCreateList = ({ editors, elements }) =>
  editors.length === 1 &&
  editors[0].isNot('li') &&
  elements.length <= 3 &&
  elements.some(x => x.is('li'))

const createList = params => {
  let { richtext, elements, listTag } = params
  const editor = params.editors[0]
  const element = elements.find(x => x.is('li'))
  if (elements[0].is('li') && editor.previousIs(listTag)) {
    const prevList = editor.previous()
    prevList.append(element)

    if (elements[1]) {
      richtext.insertAfter(editor, elements[1])
    }
    if (editor.nextIs(listTag)) {
      editor
        .next()
        .moveChildrenTo(prevList)
        .remove()
    }
    editor.remove()
  } else if (elements[elements.length - 1].is('li') && editor.nextIs(listTag)) {
    editor.next().shift(element)
    if (elements[0].isNot('li')) {
      richtext.insertAfter(editor, elements[0])
    }
    editor.remove()
  } else {
    elements = elements.map(x => (x.is('li') ? el(listTag).append(x) : x))
    richtext.insertAfter(editor, elements).remove(editor)
  }
}

const shouldAppendOrDeleteListItem = ({ editors, elements }) =>
  editors.length === 2 &&
  editors.some(x => x.is('li')) &&
  elements.length === 1 &&
  elements[0].is('li')

const appendOrDeleteListItem = params => {
  const [editor1, editor2] = params.editors
  const element = params.elements[0]
  if (editor1.is('li')) {
    const list = editor1.parent()
    list.insertAfter(editor1, element)
    editor1.remove()
    editor2.remove()
  }
}

const shouldChangeToSingle = ({ editors, elements }) =>
  editors.some(x => x.is('li')) &&
  elements.length === 1 &&
  elements[0].isNot('li')

const changeToSingle = params => {
  const { richtext, editors, listTag } = params
  const element = params.elements[0]
  const listItem = editors.find(x => x.is('li'))
  const list = listItem.parent()
  if (listItem.is(list.firstChild())) {
    richtext.insertBefore(list, element)
  } else if (listItem.is(list.lastChild())) {
    richtext.insertAfter(list, element)
  } else {
    const rest = list.removeFrom(listItem).splice(1)
    richtext.insertAfter(list, el(listTag).append(rest))
    richtext.insertAfter(list, element)
  }

  editors.forEach(x => x.remove())
  if (list.count() === 0) {
    list.remove()
  }
}

const shouldChangeToMultiple = ({ editors, elements }) =>
  editors.length === 1 &&
  editors[0].is('li') &&
  elements.length === 2 &&
  elements.some(x => x.is('li'))

const changeToMultiple = params => {
  const { richtext, elements } = params
  const listItem = params.editors[0]
  const list = listItem.parent()
  if (listItem.is(list.lastChild())) {
    listItem.remove()
    list.append(elements[0])
    if (elements[1].is('li')) {
      list.append(elements[1])
    } else {
      richtext.insertAfter(list, elements[1])
    }
  } else {
    const rest = list.removeFrom(listItem).slice(1)
    list.append(elements[0])
    richtext.insertAfter(list, el.withTag(list).append(rest))
    richtext.insertAfter(list, elements[1])
  }
}

const shouldChangeListType = ({ editors, elements, listTag }) =>
  editors.length === 1 &&
  editors[0].is('li') &&
  elements.length === 1 &&
  elements[0].is('li') &&
  listTag &&
  editors[0].parent().isNot(listTag)

const changeListType = params => {
  const { richtext, listTag } = params
  const list = params.editors[0].parent()
  const item = params.editors[0]
  const newItem = params.elements[0]

  let newList = el(listTag).append(newItem)
  if (list.firstChild().is(item)) {
    richtext.insertBefore(list, newList)
  } else if (list.lastChild().is(item)) {
    richtext.insertAfter(list, newList)
  } else {
    const rest = list.removeFrom(item).splice(1)
    richtext.insertAfter(list, el.withTag(list).append(rest))
    richtext.insertAfter(list, newList)
  }

  item.remove()
  if (list.count() === 0) {
    list.remove()
  }

  const prev = newList.previous()
  if (prev && prev.is(listTag)) {
    newList.moveChildrenTo(prev).remove()
    newList = prev
  }

  const next = newList.next()
  if (next && next.is(listTag)) {
    next.moveChildrenTo(newList).remove()
  }
}

const shouldModifyListItem = ({ editors, elements }) =>
  editors.length === 1 &&
  editors[0].is('li') &&
  elements.length === 1 &&
  elements[0].is('li')

const modifyListItem = params => {
  const listItem = params.editors[0]
  const element = params.elements[0]
  listItem.parent().insertAfter(listItem, element)
  listItem.remove()
}

const addElements = params =>
  params.richtext
    .insertAfter(params.editors[0], params.elements)
    .remove(params.editors)

export { renderText }
