import { setCursor } from './editor'

function handleEnter(editor) {
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

export { handleEnter }
