import { el } from './../../DOM/Query'
import { renderImage } from './../../DOM/imageRenderer'

let richtext
beforeEach(() => (richtext = el('div')))

function expectHtml(html) {
  const withoutStyle = richtext.element.innerHTML.replace(/\sstyle=".+?"/g, '')
  expect(withoutStyle).toBe(
    html.replace(
      '[figure]',
      '<figure><img><button>Remove</button><figcaption></figcaption></figure>'
    )
  )
}

it('put <img> at the end if editor is null', () => {
  el('p')
    .val('Paragraph')
    .appendTo(richtext)
  renderImage({
    richtext,
    editor: null,
    elements: [el('img')]
  })
  expectHtml('<p>Paragraph</p>[figure]')
})

it('put <img> between paragraphs', () => {
  const editor = el('p')
    .val('FirstSecond')
    .appendTo(richtext)
  renderImage({
    richtext,
    editor,
    elements: [el('p').val('First'), el('img'), el('p').val('Second')]
  })
  expectHtml('<p>First</p>[figure]<p>Second</p>')
})

it('put <img> between list items', () => {
  el('ul')
    .append(el('li').val('FirstSecond'))
    .append(el('li').val('Third'))
    .appendTo(richtext)
  const editor = richtext.firstChild().firstChild()
  renderImage({
    richtext,
    editor,
    elements: [el('li').val('First'), el('img'), el('li').val('Second')]
  })
  expectHtml(
    '<ul><li>First</li></ul>[figure]<ul><li>Second</li><li>Third</li></ul>'
  )
})
