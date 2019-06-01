function check(renderModel) {
  if (!renderModel || !renderModel.list || !renderModel.list.length) {
    throw new Error(
      "'renderModel' object be valid and contain a non-empty list"
    )
  }
}

function render(richtext, editor, renderModel1, renderModel2) {
  if (renderModel2) {
    check(renderModel1)
    check(renderModel2)
    renderList(richtext, editor, [...renderModel1.list, ...renderModel2.list])
    return renderModel2.active
  }
  check(renderModel1)
  renderList(richtext, editor, renderModel1.list)
  return renderModel1.active
}

function renderList(richtext, editor, list) {
  richtext.insertAfter(editor, list).remove(editor)
}

export { render }
