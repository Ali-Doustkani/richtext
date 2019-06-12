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
        return effects[prop]
      }
    }
    throw new Error('Unsupported node')
  }

  function getParentEffects(editor) {
    return editor.is('p') ? [] : [getEffect(editor)]
  }
}

export { read }
