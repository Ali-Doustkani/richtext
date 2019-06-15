import { checkEffects, checkEditor, addDefaultEffects } from './args'
import { el, render, relativeRange } from './DOM'
import { style } from './Stylist'
import { showDialog } from './Dialogue'
import * as Handle from './keyHandler'
import * as Editor from './editor'

/**
 * It creates a configurator function based on the effects.
 * @param {object} effects Effects to configure the richtext. Effects contain tags and classes that are used to decorate text in editors(p, pre, div, h1, etc.).
 * @returns {Function} The function that configures the given <div> or <article> element as the editor.
 */
function create(effects) {
  let staySelected = false

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

    const setStyle = options => {
      let { start, end, type, listTag, editor } = options
      const elements = style(effects, start, end, type, editor)
      render({
        richtext,
        editors: editor,
        elements: elements.list,
        listTag
      })
      if (typeof type === 'string' && effects[type].parent) {
        end -= start
        start = 0
      }
      Editor.setCursor(elements.active, staySelected ? start : end, end)
    }

    const styleSelectedOrAll = (type, listTag) => {
      const editor = el.active()
      if (Editor.isNotEditor(richtext, editor)) {
        return
      }
      let { start, end } = relativeRange(editor)
      if (start === end) {
        start = 0
        end = el.active().length
      }
      setStyle({ start, end, type, listTag, editor })
    }

    const ifReady = func => {
      const editor = el.active()
      if (Editor.isNotEditor(richtext, editor)) {
        return
      }
      const { start, end } = relativeRange(editor)
      if (start === end) {
        return
      }
      func(start, end, editor)
    }

    return {
      staySelected: value => (staySelected = value),
      style: type => {
        ifReady((start, end, editor) => setStyle({ start, end, type, editor }))
      },
      styleLink: () => {
        ifReady((start, end, editor) => {
          showDialog(richtext).succeeded(link => {
            setStyle({
              start,
              end,
              type: { tag: 'a', href: link },
              editor
            })
          })
        })
      },
      apply: type => styleSelectedOrAll(type),
      applyUnorderedList: () => styleSelectedOrAll('list', 'ul'),
      applyCodebox: () => styleSelectedOrAll('codebox'),
      applyOrderedList: () => styleSelectedOrAll('list', 'ol')
    }
  }
}

export default create
