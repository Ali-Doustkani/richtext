import { effectsAreOk } from './utils'

function create(effects) {
  effectsAreOk(effects)

  return editor => {
    const ret = []
    const parentEffects = getParentEffects(editor)
    let node = editor.firstChild
    if (node === null) {
      return [{ text: '' }]
    }
    while (node !== null) {
      ret.push(drillDown(node, [...parentEffects]))
      node = node.nextSibling
    }
    return ret
  }

  function drillDown(node, effects) {
    if (node === null || node.nodeType === Node.TEXT_NODE) {
      const text = node ? node.textContent : ''
      if (effects.length == 0) {
        return { text }
      }
      return { text, effects }
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      effects.unshift(getEffect(node))
      return drillDown(node.firstChild, effects)
    }
  }

  function getEffect(node) {
    for (let prop in effects) {
      const e = effects[prop]
      const classEquals =
        node.className || e.className ? e.className === node.className : true

      if (e.tag && e.tag.toUpperCase() === node.nodeName && classEquals) {
        return effects[prop]
      }
    }
    throw new Error('Unsupported nodeName: ' + nodeName)
  }

  function getParentEffects(editor) {
    return editor.tagName === 'P' ? [] : [getEffect(editor, editor.tagName)]
  }
}

export default create
