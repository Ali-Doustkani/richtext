import createDomReader from './DOM/DomReader'
import { render } from './DOM/Renderer'
import { standardizeRules } from './DOM/utils'
import { el } from './DOM/Query'
import preEditor from './preEditor'
import { absoluteRange, relativeRange } from './Range'
import createService from './Facade'

/**
 * It creates a configurator function based on the rules.
 * @param {object} rules Rules to configure the richtext. Rules contain tags and classes that are used to decorate text in editors(p, pre, div, h1, etc.).
 * @returns {Function} The function that configures the given <div> or <article> element as the editor.
 */
function create(rules) {
  let staySelected = false
  rules = standardizeRules(rules)

  return function(richtext) {
    checkEditor(rules, richtext)
    const richtextQuery = el(richtext)

    const services = createService(rules)

    richtext.addEventListener(
      'keydown',
      e => {
        const editor = el(document.activeElement)
        const context = {
          render: model => render(richtextQuery, editor, model),
          render2: (editor, model) => render(richtextQuery, editor, model),
          services,
          controller: editorController(rules, richtextQuery, editor),
          newController: ed => editorController(rules, richtextQuery, ed)
        }

        if (e.key === 'Enter') {
          handleEnterKey(e, context)
        } else if (e.key === 'Backspace') {
          handleBackspaceKey(e, context)
        } else if (e.key === 'Delete') {
          handleDeleteKey(e, context)
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          handleArrowUp(e, context)
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          handleArrowDown(e, context)
        }
      },
      true
    )

    return {
      staySelected: value => (staySelected = value),

      apply: (start, end, styleName) => {
        const active = render(
          richtextQuery,
          el(document.activeElement),
          services.style(start, end, styleName)
        )
        if (styleName === 'header') {
          start = 0
          end = active.val().length
        }
        editorController(rules, richtextQuery, active).setPosition(
          staySelected ? start : end,
          end
        )
      },

      make: styleName => {
        const editor = el(document.activeElement)
        editorController(
          rules,
          richtextQuery,
          render(
            richtextQuery,
            editor,
            services.style(0, editor.val().length, styleName)
          )
        ).setPosition(editor.val().length, editor.val().length)
        // editorQuery()
        //   .style(styleName, 0, editorQuery().length)
        //   .setPosition(editorQuery().length, editorQuery().length)
      }
    }
  }
}

function checkEditor(rules, richtext) {
  if (richtext.tagName !== 'DIV' && richtext.tagName !== 'ARTICLE') {
    throw new Error('the richtext can only be a <div> or <article> element')
  }
  if (richtext.contentEditable === true) {
    throw new Error(
      `the contentEditable of <${richtext.tagName}> richtext must be false`
    )
  }
  if (!richtext.children.length) {
    el(richtext).append(el('p').isEditable())
  }
  if (richtext.firstChild.nodeName !== 'P') {
    throw new Error('only <p> element is valid inside richtext')
  }
}

function handleEnterKey(event, { controller, services, render }) {
  event.preventDefault() // prevent creating new lines in the same p element
  if (controller.editor().is('PRE') && !event.ctrlKey) {
    preEditor(controller).break()
    return
  }
  render(
    services.breakAt(controller.model(), controller.relativeRange())
  ).element.focus()
}

function handleBackspaceKey(
  event,
  { controller, newController, services, render2 }
) {
  if (!controller.isCursorAtBeginning() || controller.isFirst()) {
    return
  }
  event.preventDefault()
  const len = controller
    .previousSibling()
    .editor()
    .val().length
  newController(
    render2(
      [controller.previousSibling().editor(), controller.editor()],
      services.glue(controller.previousSibling().model(), controller.model())
    )
  ).setPosition(len)
}

function handleDeleteKey(
  event,
  { controller, newController, services, render2 }
) {
  if (!controller.isCursorAtEnd() || controller.isLast()) {
    return
  }
  const len = controller.editor().val().length
  event.preventDefault()
  newController(
    render2(
      [controller.editor(), controller.nextSibling().editor()],
      services.glue(controller.model(), controller.nextSibling().model())
    )
  ).setPosition(len)
}

function handleArrowUp(event, { controller }) {
  const range = window.getSelection().getRangeAt(0)
  if (range.startOffset === 0 && range.endOffset === 0) {
    event.preventDefault()
    controller.focusPrev()
  }
}

function handleArrowDown(event, { controller }) {
  const relRange = controller.relativeRange()
  const len = controller.editor().val().length
  if (relRange.start === len && relRange.end === len) {
    event.preventDefault()
    controller.focusNext()
  }
}

////////////////
function editorController(rules, richtext, editor) {
  const read = createDomReader(rules)
  const w = {
    richtext: () => el(richtext),
    editor: () => editor,
    model: () => read(editor),
    relativeRange: () =>
      relativeRange(editor, window.getSelection().getRangeAt(0)),
    isCursorAtBeginning: () => {
      const range = relativeRange(editor, window.getSelection().getRangeAt(0))
      return range.start === 0 && range.end === 0
    },
    isFirst: () => editor.previousSibling() === null,
    previousSibling: () =>
      editorController(rules, richtext, editor.previousSibling()),
    nextSibling: () => editorController(rules, richtext, editor.nextSibling()),
    isCursorAtEnd: () => {
      const range = relativeRange(editor, window.getSelection().getRangeAt(0))
      const len = editor.val().length
      return range.start === len && range.end === len
    },
    isLast: () => editor.nextSibling() === null,
    setPosition: (start, end) => {
      end = end || start
      const points = absoluteRange(editor, { start, end })
      const range = document.createRange()
      range.setStart(points.startContainer, points.startOffset)
      range.setEnd(points.endContainer, points.endOffset)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    },
    focus: () => editor.element.focus(),
    focusPrev: () => {
      if (!w.isFirst()) {
        const prev = w.previousSibling()
        prev.focus()
        prev.setPosition(prev.editor().val().length)
      }
    },
    focusNext: () => {
      if (!w.isLast()) {
        const next = w.nextSibling()
        next.focus()
        next.setPosition(0)
      }
    }
  }
  return w
}

export default create
