import createRichtext from './../src/Richtext'
import { el, relativeRange } from './../src/DOM'

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
  },
  codebox: {
    parent: true,
    tag: 'pre'
  },
  list: {
    parent: true,
    tag: 'li'
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
  editor.staySelected(e.target.checked)
}

wire('bold', sel => editor.apply(sel.start, sel.end, 'bold'))

wire('italic', sel => editor.apply(sel.start, sel.end, 'italic'))

wire('highlight', sel => editor.apply(sel.start, sel.end, 'highlight'))

wire('header', sel => {
  if (sel.start === sel.end) {
    editor.make('header')
  } else {
    editor.apply(sel.start, sel.end, 'header')
  }
})

wire('codebox', sel => {
  if (sel.start === sel.end) {
    editor.make('codebox')
  } else {
    editor.apply(sel.start, sel.end, 'codebox')
  }
})

wire('list', sel => {
  if (sel.start === sel.end) {
    editor.make('list')
  } else {
    editor.apply(sel.start, sel.end, 'list')
  }
})