import createRichtext from './../src/Richtext'
import { el, relativeRange } from './../src/DOM'

const div = document.getElementById('editor')
const richtext = createRichtext({
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
      el(document.activeElement),
      window.getSelection().getRangeAt(0)
    )
    func(sel)
  }
}

document.getElementById('staySelected').onchange = e => {
  richtext.staySelected(e.target.checked)
}

wire('bold', sel => richtext.setStyle(sel.start, sel.end, 'bold'))

wire('italic', sel => richtext.setStyle(sel.start, sel.end, 'italic'))

wire('highlight', sel => richtext.setStyle(sel.start, sel.end, 'highlight'))

wire('header', sel => {
  if (sel.start === sel.end) {
    richtext.make('header')
  } else {
    richtext.setStyle(sel.start, sel.end, 'header')
  }
})

wire('codebox', () => richtext.applyCodebox())

wire('list', () => richtext.applyUnorderedList())
