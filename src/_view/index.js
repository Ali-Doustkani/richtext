import createRichtext from './../Richtext'
import { relativeRange } from './../Range'

const div = document.getElementById('editor')
const editor = createRichtext({
  bold: 'b',
  italic: 'i',
  highlight: {
    tag: 'span',
    className: 'text-highlight'
  },
  header: {
    parent: true,
    tag: 'h1',
    className: 'header-style'
  }
})(div)
div.firstChild.focus()

function wire(id, func) {
  document.getElementById(id).onmousedown = e => e.preventDefault()
  document.getElementById(id).onclick = () => {
    const sel = relativeRange(
      document.activeElement,
      window.getSelection().getRangeAt(0)
    )
    func(sel)
  }
}

document.getElementById('staySelected').onchange = e => {
  editor.staySelected(e.target.checked)
}

wire('bold', sel => editor.apply(sel.start, sel.end, 'bold'))

wire('italic', sel => editor.apply(sel.start, sel.end, 'italic'))

wire('highlight', sel => editor.apply(sel.start, sel.end, 'highlight'))

wire('header', sel => editor.apply(sel.start, sel.end, 'header'))
