import { traverse } from './PreOrderTravers'
/**
 * It reads the editor and returns an array of style models.
 * @param {Array} decors Decor array.
 * @param {HTMLElement} editor Current editor.
 */
function read(decors, editor) {
  const ret = []
  traverse(editor).forEach(leaf => ret.push(toStyle(leaf)))
  return ret

  function toStyle(node) {
    return { text: node.val(), decors: toDecors(node) }
  }

  function toDecors(node) {
    const result = []
    while (node.isNot(editor.parent())) {
      const decor = getDecor(node)
      if (decor) {
        result.push(decor)
      }
      node = node.parent()
    }
    return result
  }

  function getDecor(el) {
    for (let prop in decors) {
      const e = decors[prop]
      if (e.tag && el.is(e.tag) && el.hasClassFrom(e)) {
        const specials = dynamicAttribs(e)
        return specials.length ? makeDecor(e, specials, el) : e
      }
    }
    return null
  }

  // values of dynamic attributes are read from DOM instead of decors array
  function dynamicAttribs(decors) {
    return Object.keys(decors).filter(
      x => x !== 'tag' && x !== 'className' && x !== 'parent'
    )
  }

  function makeDecor(decor, specials, element) {
    const ret = { tag: decor.tag }
    if (decor.className) {
      ret.className = decor.className
    }
    specials.forEach(item => (ret[item] = element.getAttribute(item)))
    return ret
  }
}

export { read }
