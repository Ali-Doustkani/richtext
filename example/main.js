import createRichtext from './../src/Richtext'

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
  document.getElementById(id).onclick = () => func()
}

document.getElementById('staySelected').onchange = e => {
  richtext.staySelected(e.target.checked)
}

wire('bold', () => richtext.style('bold'))
wire('italic', () => richtext.style('italic'))
wire('highlight', () => richtext.style('highlight'))
wire('header', () => richtext.apply('header'))
wire('codebox', () => richtext.applyCodebox())
wire('list', () => richtext.applyUnorderedList())
wire('orderedList', () => richtext.applyOrderedList())
