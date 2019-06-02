function check(renderModel) {
  if (!renderModel || !renderModel.list || !renderModel.list.length) {
    throw new Error(
      "'renderModel' object be valid and contain a non-empty list"
    )
  }
}

function render(richtext, editors, renderModel) {
  if (Array.isArray(renderModel)) {
    let list = []
    renderModel.forEach(item => {
      check(item)
      list = list.concat(item.list)
    })
    renderList(richtext, editors, list)
    return renderModel[renderModel.length - 1].active
  }
  check(renderModel)
  renderList(richtext, editors, renderModel.list)
  return renderModel.active
}

function renderList(richtext, editors, list) {
  if (Array.isArray(editors)) {
    const lastEditor = editors[editors.length - 1]
    richtext.insertAfter(lastEditor, list).remove(editors)
  } else {
    richtext.insertAfter(editors, list).remove(editors)
  }
}

export { render }
