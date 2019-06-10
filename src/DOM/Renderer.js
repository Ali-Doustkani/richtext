import { el } from './Query'

function check(renderModel) {
  if (!renderModel || !renderModel.list || !renderModel.list.length) {
    throw new Error(
      "'renderModel' object be valid and contain a non-empty list"
    )
  }
}

function render(richtext, editors, renderModels) {
  editors = array(editors)
  renderModels = array(renderModels)
  let list = []
  renderModels.forEach(item => {
    check(item)
    list = list.concat(item.list)
  })
  if(editors[0].is('ul') && editors[1].isNot('li')){
    const ul = editors[0]
    ul.remove(ul.lastChild())
    richtext.remove(editors[1])
    ul.append(list[0])
    
  }else{
  insert(richtext, editors, list)}
  return renderModels[renderModels.length - 1].active
}

function array(value) {
  if (Array.isArray(value)) {
    return value
  }
  return [value]
}

function insert(richtext, editors, list) {
  const lastEditor = editors[editors.length - 1]
  if (list[0].is('li')) {
    if (lastEditor.parent().is('ul')) {
      lastEditor.parent().insertAfter(lastEditor, list.filter(x => x.is('li')))

      const ul = lastEditor.parent()
      list
        .filter(x => x.isNot('li'))
        .forEach(item => ul.parent().insertAfter(ul, item))

      lastEditor.parent().remove(editors)
    } else if (
      lastEditor.previousSibling() &&
      lastEditor.previousSibling().is('ul')
    ) {
      const prev = lastEditor.previousSibling()
      prev.append(list[0])
      if (lastEditor.nextSibling() && lastEditor.nextSibling().is('ul')) {
        const next = lastEditor.nextSibling()
        for (let i = 0; i < next.length; i++) {
          const a = next.child(i)
          prev.append(a)
        }
        richtext.remove(next)
      }
      richtext.remove(editors)
    } else if (lastEditor.nextSibling() && lastEditor.nextSibling().is('ul')) {
      // lastEditor
      //   .nextSibling()
      //   .shift(list)
      //   .remove(editors)
    } else {
      surroundListItems(list)
      richtext.insertAfter(lastEditor, list).remove(editors)
    }
  } else {
    surroundListItems(list)
    richtext.insertAfter(lastEditor, list).remove(editors)
  }
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

export { render }
