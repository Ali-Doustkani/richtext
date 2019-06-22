import { checkEditor, checkOptions, setOptions } from './args'
import { el, renderText } from './DOM'
import { relativeRange } from './Ranging'
import { style } from './Stylist'
import { showDialog } from './Dialog'
import * as Editor from './editor'
import { importImage } from './image'
import createKeyHandler from './keyHandler'
import createMouseHandler from './mouseHandler'

/**
 * It creates the richtext component.
 * @param {HTMLElement} element The given <div> or <article> that should work as a richtext.
 * @param {object} options The contifuration object which includes decors and other options.
 */
function create(element, options) {
  checkEditor(element)
  options = checkOptions(options)

  const richtext = el(element)
  let editor = richtext.firstChild()
  const handleKey = createKeyHandler(richtext, options.decors)
  const handleMouse = createMouseHandler(richtext)
  element.addEventListener('keydown', handleKey.keyDown, true)
  element.addEventListener('keyup', handleKey.keyUp, true)
  element.addEventListener('click', handleMouse)
  element.addEventListener('focus', e => (editor = el(e.target)), true)

  const setStyle = params => {
    let { range, type, listTag, editor } = params
    const elements = style(options.decors, range, type, editor)
    renderText({
      richtext,
      editors: editor,
      elements: elements.list,
      listTag
    })
    range =
      typeof type === 'string' && options.decors[type].parent
        ? range.shiftToStart()
        : range
    range = options.staySelected ? range : range.toEnd()
    Editor.setCursor(elements.active, range)
  }

  const styleSelectedOrAll = (type, listTag) => {
    if (Editor.isNotEditor(richtext, editor)) {
      return
    }
    const range = relativeRange(editor).selectedForSure(editor.textLength)
    setStyle({ range, type, listTag, editor })
  }

  const ifReady = func => {
    if (Editor.isNotEditor(richtext, editor)) {
      return
    }
    const range = relativeRange(editor)
    if (range.standing()) {
      return
    }
    func(range, editor)
  }

  return {
    setOptions: value => setOptions(value, options),
    style: type =>
      ifReady((range, editor) => setStyle({ range, type, editor })),
    styleLink: () =>
      ifReady((range, editor) => {
        showDialog({
          richtext,
          defaultValue: options.defaultLink,
          succeeded: link => {
            setStyle({
              range,
              type: { tag: 'a', href: link },
              editor
            })
          }
        })
      }),
    apply: styleSelectedOrAll,
    applyUnorderedList: () => styleSelectedOrAll('list', 'ul'),
    applyCodebox: () => styleSelectedOrAll('codebox'),
    applyOrderedList: () => styleSelectedOrAll('list', 'ol'),
    selectImage: () => importImage(richtext, editor, options.decors)
  }
}

export { create }
