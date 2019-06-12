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

    const setStyleOrMake = (styleName, listTag) => {
      const sel = relativeRange(el.active())
      const editor = el.active()
      const [start, end] =
        sel.start === sel.end ? [0, editor.length] : [sel.start, sel.end]
      const elements = style(effects, start, end, styleName)
      render({ richtext, editors: editor, elements: elements.list, listTag })
      Editor.setCursor(elements.active, staySelected ? start : end, end)
    }

    return {
      staySelected: value => (staySelected = value),
      setStyle: (start, end, styleName) => {
        const elements = style(effects, start, end, styleName)
        render({ richtext, editors: el.active(), elements: elements.list })
        if (styleName === 'header') {
          start = 0
          end = elements.active.val().length
        }
        Editor.setCursor(elements.active, staySelected ? start : end, end)
      },
      make: styleName => {
        const editor = el.active()
        const elements = style(effects, 0, editor.length, styleName)
        render({ richtext, editors: editor, elements: elements.list })
        Editor.setCursor(elements.active, editor.length, editor.length)
      },
      applyUnorderedList: () => setStyleOrMake('list', 'ul'),
      applyCodebox: () => setStyleOrMake('codebox'),
      applyOrderedList: () => setStyleOrMake('list', 'ol')
    }
  }
}

export default create
