import style from './Stylist/Stylist'
import createDomReader from './DOM/DomReader'
import { absoluteRange, relativeRange } from './Range'
import { renderTo } from './DOM/DomWriter'
import { breakAt } from './Stylist/Break'

function createRichParagraph(rules, editor, model) {
  const paragraph = document.createElement('p')
  paragraph.contentEditable = true
  if (model) {
    renderTo(paragraph, model)
  }
  return toRichParagraph(rules, editor, paragraph)
}

function toRichParagraph(rules, editor, paragraph) {
  const read = createDomReader(rules)
  const w = {
    create: model => createRichParagraph(rules, editor, model),

    paragraph: () => paragraph,

    style: (styleName, start, end) =>
      w.render(
        style({
          type: rules[styleName],
          input: read(paragraph),
          from: start,
          to: end
        })
      ),

    break: () =>
      breakAt(
        w.model,
        relativeRange(paragraph, window.getSelection().getRangeAt(0))
      ),

    render: model => {
      renderTo(paragraph, model)
      return w
    },

    setPosition: (start, end) => {
      end = end || start
      const points = absoluteRange(paragraph, { start, end })
      const range = document.createRange()
      range.setStart(points.startContainer, points.startOffset)
      range.setEnd(points.endContainer, points.endOffset)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
      return w
    },

    focusPrev: () => {
      if (!w.isFirst) {
        const prev = w.prev
        prev.paragraph().focus()
        prev.setPosition(prev.length)
      }
    },

    focusNext: () => {
      if (!w.isLast) {
        const next = w.next
        next.paragraph().focus()
        next.setPosition(0)
      }
    },

    attach: () => {
      editor.appendChild(paragraph)
      return w
    },

    replaceWith: (p1, p2) => {
      p1 = p1.paragraph()
      p2 = p2.paragraph()
      editor.removeChild(p1)
      editor.insertBefore(paragraph, p2)
      editor.removeChild(p2)
      paragraph.focus()
      return w
    },

    addAfter: p => {
      p = p.paragraph()
      p.insertAdjacentElement('afterend', paragraph)
      paragraph.focus()
      return w
    },

    get model() {
      return read(paragraph)
    },

    get prev() {
      if (!paragraph.previousSibling) {
        return null
      }
      return toRichParagraph(rules, editor, paragraph.previousSibling)
    },

    get next() {
      if (!paragraph.nextSibling) {
        return null
      }
      return toRichParagraph(rules, editor, paragraph.nextSibling)
    },

    get length() {
      return paragraph.textContent.length
    },

    get isCursorAtBeginning() {
      const range = relativeRange(
        paragraph,
        window.getSelection().getRangeAt(0)
      )
      return range.start === 0 && range.end === 0
    },

    get isCursorAtEnd() {
      const range = relativeRange(
        paragraph,
        window.getSelection().getRangeAt(0)
      )
      return range.start === w.length && range.end === w.length
    },

    get isFirst() {
      return paragraph.previousSibling === null
    },

    get isLast() {
      return paragraph.nextSibling === null
    }
  }
  return w
}

export { toRichParagraph, createRichParagraph }
