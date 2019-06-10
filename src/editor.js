import { absoluteRange, relativeRange } from './DOM'

function canBackspace(editor) {
  const { start, end } = relRange(editor)
  return start === 0 && end === 0 && isNotFirst(editor)
}

function canDelete(editor) {
  const { start, end } = relRange(editor)
  const len = editor.val().length
  return start === len && end === len && isNotLast(editor)
}

function focusPrev(editor) {
  if (isNotFirst(editor)) {
    const prev = editor.previous()
    prev.element.focus()
    setCursor(prev, prev.val().length)
  }
}

function focusNext(editor) {
  if (isNotLast(editor)) {
    const next = editor.next()
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

function isNotFirst(editor) {
  return editor.previous() !== null
}

function isNotLast(editor) {
  return editor.next() !== null
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

export {
  canBackspace,
  canDelete,
  focusPrev,
  focusNext,
  setCursor,
  handlePreEnter
}
