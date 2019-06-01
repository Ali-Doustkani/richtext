function render(richtext, editor, renderModel) {
  const { list, active } = renderModel
  richtext.replaceChild(list[0], editor)
  for (let i = 1; i < list.length; i++) {
    richtext.insertBefore(list[i], list[i - 1].nextSibling)
  }
  return active
}

function render2(richtext, editor, r1, r2) {
  let next
  if (r1.list.length) {
    richtext.replaceChild(r1.list[0], editor)
    next = r1.list[0]
    for (let i = 1; i < r1.list.length; i++) {
      next = r1.list[i - 1]
      richtext.insertBefore(r1.list[i], next.nextSibling)
    }
  } else {
    editor.innerHTML = ''
    next = editor
  }
  richtext.insertBefore(r2.list[0], next.nextSibling)
  for (let i = 1; i < r2.list.length; i++) {
    richtext.insertBefore(r2.list[i], r2.list[i - 1].nextSibling)
  }
  return r2.active
}

export { render, render2 }
