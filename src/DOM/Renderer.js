import { el } from './Query'

function render(richtext, editors, renderModels) {
  editors = array(editors)
  if (shouldMoveToList(editors)) {
    moveToList(editors, renderModels)
    return renderModels.active
  }
  if (shouldAppendToList(editors)) {
    appendToList(editors, renderModels)
    return renderModels.active
  }
  if (shouldMergeList(editors)) {
    merge(richtext, editors, renderModels)
    return renderModels.active
  }
  surroundItemsAndInsert(richtext, editors, renderModels)
  return renderModels.active
}

function shouldMoveToList(editors) {
  return editors.length === 2 && editors[0].is('ul') && editors[1].isNot('li')
}

function moveToList([list, other], renderModel) {
  list.remove(list.lastChild())
  other.remove()
  list.append(renderModel.list[0])
}

function shouldAppendToList(editors) {
  return editors.length === 1 && editors[0].parent().is('ul')
}

function appendToList(editors, renderModels) {
  const allModels = flattenModels(renderModels)
  const listItem = editors[0]
  const list = listItem.parent()
  list.insertAfter(listItem, allModels.filter(x => x.is('li')))
  allModels
    .filter(x => x.isNot('li'))
    .forEach(item => list.parent().insertAfter(list, item))
  list.remove(listItem)
}

function shouldMergeList(editors) {
  return (
    editors.length === 1 &&
    ((editors[0].previousSibling() && editors[0].previousSibling().is('ul')) ||
      (editors[0].nextSibling() && editors[0].nextSibling().is('ul')))
  )
}

function merge(richtext, editors, renderModels) {
  const cur = editors[0]
  if (cur.previousSibling() && cur.previousSibling().is('ul')) {
    const prevList = cur.previousSibling().append(renderModels.list[0])
    if (cur.nextSibling() && cur.nextSibling().is('ul')) {
      cur
        .nextSibling()
        .moveChildrenTo(prevList)
        .remove()
    }
  } else if (cur.nextSibling() && cur.nextSibling().is('ul')) {
    cur.nextSibling().shift(renderModels.list[0])
  }

  richtext.remove(editors)
}

function array(value) {
  if (Array.isArray(value)) {
    return value
  }
  return [value]
}

function surroundItemsAndInsert(richtext, editors, renderModels) {
  const list = flattenModels(renderModels)
  const lastEditor = editors[0]
  surroundListItems(list)
  richtext.insertAfter(lastEditor, list).remove(editors)
}

function surroundListItems(list) {
  let ul
  for (let i = 0; i < list.length; i++) {
    if (list[i].is('li')) {
      if (!ul) {
        ul = el('ul')
      }
      ul.append(list[i])
      list.splice(i, 1)
      i--
    } else {
      if (ul) {
        list.splice(i, 0, ul)
        i++
        ul = null
      }
    }
  }
  if (ul) {
    list.push(ul)
  }
}

function flattenModels(renderModels) {
  const a = array(renderModels)
  let list = []
  a.forEach(item => {
    check(item)
    list = list.concat(item.list)
  })
  return list
}

function check(renderModel) {
  if (!renderModel || !renderModel.list || !renderModel.list.length) {
    throw new Error(
      "'renderModel' object be valid and contain a non-empty list"
    )
  }
}

export { render }
