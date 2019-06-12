import { el } from './Query'

function render(params) {
  let { richtext, editors, elements, listTag } = params
  editors = Array.isArray(editors) ? editors : [editors]
  if (shouldCreateList(editors, elements)) {
    createList(richtext, editors[0], elements[0], listTag)
  } else if (shouldAppendOrDeleteListItem(editors, elements)) {
    appendOrDeleteListItem(editors, elements[0])
  } else if (shouldChangeToSingle(editors, elements)) {
    changeToSingle(richtext, editors, elements[0], listTag)
  } else if (shouldChangeToMultiple(editors, elements)) {
    changeToMultiple(richtext, editors[0], elements)
  } else if (shouldModifyListItem(editors, elements)) {
    modifyListItem(editors[0], elements[0])
  } else {
    richtext.insertAfter(editors[0], elements).remove(editors)
  }
}

function shouldCreateList(editors, elements) {
  return (
    editors.length === 1 &&
    editors[0].isNot('li') &&
    elements.length === 1 &&
    elements[0].is('li')
  )
}

function createList(richtext, editor, element, listTag) {
  if (editor.previousIs(listTag)) {
    const prevList = editor.previous()
    prevList.append(element)
    if (editor.nextIs(listTag)) {
      editor
        .next()
        .moveChildrenTo(prevList)
        .remove()
    }
    editor.remove()
  } else if (editor.nextIs(listTag)) {
    editor.next().shift(element)
    editor.remove()
  } else {
    richtext.insertAfter(editor, el(listTag).append(element)).remove(editor)
  }
}

function shouldAppendOrDeleteListItem(editors, elements) {
  return (
    editors.length === 2 &&
    editors.some(x => x.is('li')) &&
    elements.length === 1 &&
    elements[0].is('li')
  )
}

function appendOrDeleteListItem([editor1, editor2], element) {
  if (editor1.is('li')) {
    const list = editor1.parent()
    list.insertAfter(editor1, element)
    editor1.remove()
    editor2.remove()
  }
}

function shouldChangeToSingle(editors, elements) {
  return (
    editors.some(x => x.is('li')) &&
    elements.length === 1 &&
    elements[0].isNot('li')
  )
}

function changeToSingle(richtext, editors, element, listTag) {
  const listItem = editors.filter(x => x.is('li'))[0]
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

function shouldChangeToMultiple(editors, elements) {
  return (
    editors.length === 1 &&
    editors[0].is('li') &&
    elements.length === 2 &&
    elements.some(x => x.is('li'))
  )
}

function changeToMultiple(richtext, listItem, elements) {
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

function shouldModifyListItem(editors, elements) {
  return (
    editors.length === 1 &&
    editors[0].is('li') &&
    elements.length === 1 &&
    elements[0].is('li')
  )
}

function modifyListItem(listItem, element) {
  listItem.parent().insertAfter(listItem, element)
  listItem.remove()
}

export { render }
