import { richedit } from './../Richtext'
import { selectionPoints } from './../Selection'

richedit.init({
  bold: 'b',
  italic: 'i',
  highlight: {
    tag: 'span',
    className: 'text-highlight'
  }
})
const div = document.getElementById('editor')
const editor = richedit(div)
div.focus()

document.getElementById('bold').onclick = () => {
  const sel = selectionPoints(div)
  editor.apply(sel.start, sel.end, richedit.bold)
}

document.getElementById('italic').onclick = () => {
  const sel = selectionPoints(div)
  editor.apply(sel.start, sel.end, richedit.italic)
}

document.getElementById('highlight').onclick = () => {
  const sel = selectionPoints(div)
  editor.apply(sel.start, sel.end, richedit.highlight)
}
