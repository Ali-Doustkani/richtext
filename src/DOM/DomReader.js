import { traverse } from './PreOrderTravers'
/**
 * It reads the editor and returns an array of style models.
 * @param {Array} effects Effect rules.
 * @param {HTMLElement} editor Current editor.
 */
function read(effects, editor) {
  const ret = []
  traverse(editor).forEach(leaf => ret.push(toStyle(leaf)))
  return ret

  function toStyle(node) {
    return { text: node.val(), effects: toEffects(node) }
  }

  function toEffects(node) {
    const result = []
    while (node.isNot(editor.parent())) {
      const effect = getEffect(node)
      if (effect) {
        result.push(effect)
      }
      node = node.parent()
    }
    return result
  }

  function getEffect(el) {
    for (let prop in effects) {
      const e = effects[prop]
      if (e.tag && el.is(e.tag) && el.hasClassFrom(e)) {
        const specials = dynamicAttribs(e)
        return specials.length ? makeEffect(e, specials, el) : e
      }
    }
    return null
  }

  // values of dynamic attributes are read from DOM instead of effects array
  function dynamicAttribs(effects) {
    return Object.keys(effects).filter(
      x => x !== 'tag' && x !== 'className' && x !== 'parent'
    )
  }

  function makeEffect(effect, specials, element) {
    const ret = { tag: effect.tag }
    if (effect.className) {
      ret.className = effect.className
    }
    specials.forEach(item => (ret[item] = element.getAttribute(item)))
    return ret
  }
}

export { read }
