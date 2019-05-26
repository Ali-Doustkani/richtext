import createRichtext from './../Richtext'
import { relativeRange } from './../Range'

const div = document.getElementById('editor')
const editor = createRichtext({
  bold: 'b',
  italic: 'i',
  highlight: {
    tag: 'span',
    className: 'text-highlight'
  }
})(div)
div.firstChild.focus()

function mouseDown(e) {
  e.preventDefault()
}

document.getElementById('staySelected').onchange = e => {
  editor.staySelected(e.target.checked)
}

document.getElementById('bold').onmousedown = mouseDown
document.getElementById('bold').onclick = () => {
  const sel = relativeRange(
    document.activeElement,
    window.getSelection().getRangeAt(0)
  )
  editor.apply(sel.start, sel.end, 'bold')
}

document.getElementById('italic').onmousedown = mouseDown
document.getElementById('italic').onclick = () => {
  const sel = relativeRange(
    document.activeElement,
    window.getSelection().getRangeAt(0)
  )
  editor.apply(sel.start, sel.end, 'italic')
}

document.getElementById('highlight').onmousedown = mouseDown
document.getElementById('highlight').onclick = () => {
  const sel = relativeRange(
    document.activeElement,
    window.getSelection().getRangeAt(0)
  )
  editor.apply(sel.start, sel.end, 'highlight')
}
