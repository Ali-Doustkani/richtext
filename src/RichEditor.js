import style from './Stylist/Stylist'
import createDomReader from './DOM/DomReader'
import render from './DOM/DomWriter'
import preEditor from './preEditor'
import { absoluteRange, relativeRange } from './Range'
import { breakAt } from './Stylist/Break'

function createRichEditor(rules, richtext, model) {
  const editor = document.createElement('p')
  editor.contentEditable = true
  if (model) {
    render(richtext, editor, model)
  }
  return toRichEditor(rules, richtext, editor)
}

function toRichEditor(rules, richtext, editor) {
  let changedStart
  const read = createDomReader(rules)
  const w = {
    create: model => createRichEditor(rules, richtext, model),

    element: () => editor,

    style: (styleName, start, end) => {
      const lastParagraph = editor
      w.render(
        style({
          type: rules[styleName],
          input: read(editor),
          from: start,
          to: end
        })
      )
      editor.focus()
      if (editor !== lastParagraph) {
        changedStart = start
      }
      return w
    },

    break: () => {
      if (w.element().tagName === 'PRE') {
        preEditor(w).break()
        return w
      }
      const [m1, m2] = breakAt(
        w.model,
        relativeRange(editor, window.getSelection().getRangeAt(0))
      )
      w.render(m1)
        .create(m2)
        .addAfter(w)
      return w
    },

    render: model => {
      editor = render(richtext, editor, model)
      return w
    },

    setPosition: (start, end) => {
      if (changedStart) {
        start -= changedStart
        end -= changedStart
      }
      end = end || start
      const points = absoluteRange(editor, { start, end })
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
        prev.element().focus()
        prev.setPosition(prev.length)
      }
    },

    focusNext: () => {
      if (!w.isLast) {
        const next = w.next
        next.element().focus()
        next.setPosition(0)
      }
    },

    attach: () => {
      richtext.appendChild(editor)
      return w
    },

    replaceWith: (p1, p2) => {
      p1 = p1.element()
      p2 = p2.element()
      richtext.removeChild(p1)
      richtext.insertBefore(editor, p2)
      richtext.removeChild(p2)
      editor.focus()
      return w
    },

    addAfter: p => {
      p = p.element()
      p.insertAdjacentElement('afterend', editor)
      editor.focus()
      return w
    },

    get model() {
      return read(editor)
    },

    get prev() {
      if (!editor.previousSibling) {
        return null
      }
      return toRichEditor(rules, richtext, editor.previousSibling)
    },

    get next() {
      if (!editor.nextSibling) {
        return null
      }
      return toRichEditor(rules, richtext, editor.nextSibling)
    },

    get length() {
      return editor.textContent.length
    },

    get isCursorAtBeginning() {
      const range = relativeRange(editor, window.getSelection().getRangeAt(0))
      return range.start === 0 && range.end === 0
    },

    get isCursorAtEnd() {
      const range = relativeRange(editor, window.getSelection().getRangeAt(0))
      return range.start === w.length && range.end === w.length
    },

    get isFirst() {
      return editor.previousSibling === null
    },

    get isLast() {
      return editor.nextSibling === null
    }
  }
  return w
}

export { toRichEditor, createRichEditor }
