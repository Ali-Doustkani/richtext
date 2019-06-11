import { absoluteRange, relativeRange } from './DOM'

function canBackspace(editor) {
  const { start, end } = relRange(editor)
  return start === 0 && end === 0 && previousEditor(editor) !== null
}

function canDelete(editor) {
  const { start, end } = relRange(editor)
  const len = editor.val().length
  return start === len && end === len && nextEditor(editor) !== null
}

function focusPrev(editor) {
  const prev = previousEditor(editor)
  if (prev) {
    prev.element.focus()
    setCursor(prev, prev.val().length)
  }
}

function focusNext(editor) {
  const next = nextEditor(editor)
  if (next) {
    next.element.focus()
    setCursor(next, 0)
  }
}

function setCursor(editor, start, end) {
  end = end || start
  const points = absoluteRange(editor, { start, end })
  const range = document.createRange()
  range.setStart(points.startContainer, points.startOffset)
  range.setEnd(points.endContainer, points.endOffset)
  const sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)
}

function relRange(editor) {
  return relativeRange(editor, window.getSelection().getRangeAt(0))
}

function handlePreEnter(editor) {
  const { startOffset, endOffset } = window.getSelection().getRangeAt(0)
  const content = editor.firstChild().val()
  if (startOffset === endOffset) {
    const first = content.slice(0, startOffset)
    const second = content.slice(startOffset)
    const newLine = startOffset === content.length ? '\n\n' : '\n'
    editor.element.firstChild.data = first + newLine + second
    setCursor(editor, startOffset + 1)
  }
}

function previousEditor(editor) {
  if (editor.is('li') && editor.is(editor.parent().firstChild())) {
    return editor.parent().previous()
  }
  const prev = editor.previous()
  if (prev && prev.is('ul')) {
    return prev.lastChild()
  }
  return prev
}

function nextEditor(editor) {
  if (editor.is('li') && editor.is(editor.parent().lastChild())) {
    return editor.parent().next()
  }
  const next = editor.next()
  if (next && next.is('ul')) {
    return next.firstChild()
  }
  return next
}

export {
  canBackspace,
  canDelete,
  focusPrev,
  focusNext,
  setCursor,
  handlePreEnter,
  previousEditor,
  nextEditor
}
