import { absoluteRange, relativeRange, Range } from './Ranging'

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

function setCursor(editor, pos) {
  if (typeof pos === 'number') {
    pos = Range.fromPosition(pos)
  }
  const points = absoluteRange(editor, pos)
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

const previousEditor = editor =>
  getNextEditor(editor, n => n.previous(), n => n.lastChild())

const nextEditor = editor =>
  getNextEditor(editor, n => n.next(), n => n.firstChild())

function getNextEditor(editor, nextNode, childOf) {
  let next = nextNode(editor)
  if (editor.is('li')) {
    if (next) {
      return next
    }
    next = nextNode(editor.parent())
  } else if (editor.is('figcaption')) {
    next = nextNode(editor.parent())
  }

  if (next && next.is('ul')) {
    return childOf(next)
  }
  if (next && next.is('figure')) {
    return next.lastChild()
  }
  return next
}

function isNotEditor(richtext, editor) {
  if (editor.is('li')) {
    return editor
      .parent()
      .parent()
      .isNot(richtext)
  }
  return editor.parent().isNot(richtext)
}

export {
  canBackspace,
  canDelete,
  focusPrev,
  focusNext,
  setCursor,
  handlePreEnter,
  previousEditor,
  nextEditor,
  isNotEditor
}
