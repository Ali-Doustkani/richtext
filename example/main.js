import createRichtext from './../src/Richtext'

const richtextEl = document.getElementById('richtext')
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
  },
  image: {
    parent: true,
    tag: 'img'
  },
  notebox: {
    parent: true,
    tag: 'div',
    className: 'notebox'
  }
})(richtextEl)
richtext.setOptions({ defaultLink: 'https://' })

function wire(id, func) {
  document.getElementById(id).onmousedown = e => e.preventDefault()
  document.getElementById(id).onclick = () => func()
}

document.getElementById('staySelected').onchange = e => {
  richtext.setOptions({ staySelected: e.target.checked })
}

wire('bold', () => richtext.style('bold'))
wire('italic', () => richtext.style('italic'))
wire('highlight', () => richtext.style('highlight'))
wire('header', () => richtext.apply('header'))
wire('codebox', () => richtext.applyCodebox())
wire('list', () => richtext.applyUnorderedList())
wire('orderedList', () => richtext.applyOrderedList())
wire('hyperlink', () => richtext.styleLink())
wire('image', () => richtext.selectImage())
wire('notebox', () => richtext.apply('notebox'))
wire(
  'direction',
  () =>
    (richtextEl.style.direction =
      richtextEl.style.direction === 'ltr' ? 'rtl' : 'ltr')
)
