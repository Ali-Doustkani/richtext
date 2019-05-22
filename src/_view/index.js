import { richtext } from './../Richtext'
import { selectionPoints } from './../Selection'

richtext.init({
  bold: 'b',
  italic: 'i',
  highlight: {
    tag: 'span',
    className: 'text-highlight'
  }
})
const div = document.getElementById('editor')
const editor = richtext(div)
div.firstChild.focus()

function mouseDown(e) {
  e.preventDefault()
}

document.getElementById('bold').onmousedown = mouseDown
document.getElementById('bold').onclick = () => {
  const sel = selectionPoints(
    document.activeElement,
    window.getSelection().getRangeAt(0)
  )
  editor.apply(sel.start, sel.end, richtext.bold)
}

document.getElementById('italic').onmousedown = mouseDown
document.getElementById('italic').onclick = () => {
  const sel = selectionPoints(
    document.activeElement,
    window.getSelection().getRangeAt(0)
  )
  editor.apply(sel.start, sel.end, richtext.italic)
}

document.getElementById('highlight').onmousedown = mouseDown
document.getElementById('highlight').onclick = () => {
  const sel = selectionPoints(
    document.activeElement,
    window.getSelection().getRangeAt(0)
  )
  editor.apply(sel.start, sel.end, richtext.highlight)
}
