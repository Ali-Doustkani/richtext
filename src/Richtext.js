import { checkEffects, checkEditor, addDefaultEffects } from './args'
import { el, render, relativeRange } from './DOM'
import { style } from './Stylist'
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

    const setStyle = (start, end, styleName, listTag) => {
      const elements = style(effects, start, end, styleName)
      render({
        richtext,
        editors: el.active(),
        elements: elements.list,
        listTag
      })
      if (effects[styleName].parent) {
        end -= start
        start = 0
      }
      Editor.setCursor(elements.active, staySelected ? start : end, end)
    }

    const styleSelectedOrAll = (styleName, listTag) => {
      const editor = el.active()
      if (Editor.isNotEditor(richtext, editor)) {
        return
      }
      let { start, end } = relativeRange(editor)
      if (start === end) {
        start = 0
        end = el.active().length
      }
      setStyle(start, end, styleName, listTag)
    }

    return {
      staySelected: value => (staySelected = value),
      style: styleName => {
        const editor = el.active()
        if (Editor.isNotEditor(richtext, editor)) {
          return
        }
        const { start, end } = relativeRange(editor)
        setStyle(start, end, styleName)
      },
      apply: styleName => styleSelectedOrAll(styleName),
      applyUnorderedList: () => styleSelectedOrAll('list', 'ul'),
      applyCodebox: () => styleSelectedOrAll('codebox'),
      applyOrderedList: () => styleSelectedOrAll('list', 'ol')
    }
  }
}

export default create
