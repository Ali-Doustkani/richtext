import { create } from './../src/Richtext'

const richtextEl = document.getElementById('richtext')
const richtext = create(richtextEl, {
  defaultLink: 'https://',
  decors: {
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
    notebox: {
      parent: true,
      tag: 'div',
      className: 'notebox'
    }
  }
})

function wireClick(id, func) {
  document.getElementById(id).onclick = () => func()
}

document.getElementById('staySelected').onchange = e =>
  richtext.setOptions({ staySelected: e.target.checked })

document.getElementById('disabled').onchange = e =>
  richtext.setOptions({ disabled: e.target.checked })

wireClick('bold', () => richtext.style('bold'))
wireClick('italic', () => richtext.style('italic'))
wireClick('highlight', () => richtext.style('highlight'))
wireClick('header', () => richtext.apply('header'))
wireClick('codebox', () => richtext.applyCodebox())
wireClick('list', () => richtext.applyUnorderedList())
wireClick('orderedList', () => richtext.applyOrderedList())
wireClick('hyperlink', () => richtext.styleLink())
wireClick('image', () => richtext.selectImage())
wireClick('notebox', () => richtext.apply('notebox'))
wireClick(
  'direction',
  () =>
    (richtextEl.style.direction =
      richtextEl.style.direction === 'ltr' ? 'rtl' : 'ltr')
)
wireClick('focus', () => richtext.focus())
