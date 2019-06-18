import {
  checkEffects,
  checkEditor,
  addDefaultEffects,
  setOptions
} from './args'
import { el, renderText } from './DOM'
import { relativeRange } from './Ranging'
import { style } from './Stylist'
import { showDialog } from './Dialogue'
import * as Handle from './keyHandler'
import * as Editor from './editor'
import { importImage } from './image'

/**
 * It creates a configurator function based on the effects.
 * @param {object} effects Effects to configure the richtext. Effects contain tags and classes that are used to decorate text in editors(p, pre, div, h1, etc.).
 * @returns {Function} The function that configures the given <div> or <article> element as the editor.
 */
function create(effects) {
  const richtextOptions = {
    staySelected: false,
    defaultLink: ''
  }

  addDefaultEffects(effects)
  if (process.env.NODE_ENV === 'development') {
    effects = checkEffects(effects)
  }

  return function(richtextElement) {
    checkEditor(richtextElement)
    const richtext = el(richtextElement)
    richtextElement.addEventListener(
      'keydown',
      e => {
        if (e.key === 'Enter') {
          Handle.enterKey(e, effects, richtext)
        } else if (e.key === 'Backspace') {
          Handle.backspaceKey(e, effects, richtext)
        } else if (e.key === 'Delete') {
          Handle.deleteKey(e, effects, richtext)
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          Handle.arrowUp(e)
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          Handle.arrowDown(e)
        }
      },
      true
    )

    richtextElement.addEventListener('click', e => {
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

    const setStyle = options => {
      let { range, type, listTag, editor } = options
      const elements = style(effects, range, type, editor)
      renderText({
        richtext,
        editors: editor,
        elements: elements.list,
        listTag
      })
      range =
        typeof type === 'string' && effects[type].parent
          ? range.shiftToStart()
          : range
      range = richtextOptions.staySelected ? range : range.toEnd()
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
      setOptions: value => setOptions(value, richtextOptions),
      style: type =>
        ifReady((range, editor) => setStyle({ range, type, editor })),
      styleLink: () =>
        ifReady((range, editor) => {
          showDialog({
            richtext,
            defaultValue: richtextOptions.defaultLink,
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
      selectImage: () => importImage(richtext, effects)
    }
  }
}

export default create
