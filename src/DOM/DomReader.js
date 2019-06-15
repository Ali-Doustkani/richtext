/**
 * It reads the editor and returns an array of style models.
 * @param {Array} effects Effect rules.
 * @param {HTMLElement} editor Current editor.
 */
function read(effects, editor) {
  const ret = []
  const parentEffects = getParentEffects(editor)
  let node = editor.firstChild()
  if (!node) {
    return [{ text: '', effects: parentEffects }]
  }
  while (node) {
    ret.push(drillDown(node, [...parentEffects]))
    node = node.next()
  }
  return ret

  function drillDown(el, effects) {
    if (!el || el.is(Node.TEXT_NODE)) {
      const text = el ? el.val() : ''
      return { text, effects }
    }
    if (el.is(Node.ELEMENT_NODE)) {
      effects.unshift(getEffect(el))
      return drillDown(el.firstChild(), effects)
    }
  }

  function getEffect(el) {
    for (let prop in effects) {
      const e = effects[prop]
      if (e.tag && el.is(e.tag) && el.hasClassFrom(e)) {
        const specials = dynamicAttribs(e)
        return specials.length ? makeEffect(e, specials, el) : e
      }
    }
    throw new Error('Unsupported node: ' + el.element.tagName)
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

  function getParentEffects(editor) {
    return editor.is('p') ? [] : [getEffect(editor)]
  }
}

export { read }
