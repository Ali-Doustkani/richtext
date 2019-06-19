import { checkEditor, checkOptions, setOptions } from './args'
import { el, renderText } from './DOM'
import { relativeRange } from './Ranging'
import { style } from './Stylist'
import { showDialog } from './Dialog'
import * as Handle from './keyHandler'
import * as Editor from './editor'
import { importImage } from './image'

/**
 * It creates the richtext component.
 * @param {HTMLElement} element The given <div> or <article> that should work as a richtext.
 * @param {object} options The contifuration object which includes decors and other options.
 */
function create(element, options) {
  checkEditor(element)
  options = checkOptions(options)

  const richtext = el(element)
  element.addEventListener(
    'keydown',
    e => {
      if (e.key === 'Enter') {
        Handle.enterKey(e, options.decors, richtext)
      } else if (e.key === 'Backspace') {
        Handle.backspaceKey(e, options.decors, richtext)
      } else if (e.key === 'Delete') {
        Handle.deleteKey(e, options.decors, richtext)
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        Handle.arrowUp(e)
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        Handle.arrowDown(e)
      }
    },
    true
  )

  element.addEventListener('click', e => {
    const anchor = el.parentOf(el(e.target), 'a')
    if (anchor) {
      showDialog({
        richtext,
        defaultValue: anchor.getAttribute('href'),
        mode: 'edit',
        succeeded: link => anchor.setAttribute('href', link),
        deleted: () => anchor.takeOff()
      })
    }
  })

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
    const editor = el.active()
    if (Editor.isNotEditor(richtext, editor)) {
      return
    }
    const range = relativeRange(editor).selectedForSure(editor.textLength)
    setStyle({ range, type, listTag, editor })
  }

  const ifReady = func => {
    const editor = el.active()
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
    apply: type => styleSelectedOrAll(type),
    applyUnorderedList: () => styleSelectedOrAll('list', 'ul'),
    applyCodebox: () => styleSelectedOrAll('codebox'),
    applyOrderedList: () => styleSelectedOrAll('list', 'ol'),
    selectImage: () => importImage(richtext, options.decors)
  }
}

export default create
