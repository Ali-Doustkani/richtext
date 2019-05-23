import { rulesAreOk } from './utils'

function create(rules) {
  rulesAreOk(rules)

  return paragraph => {
    const ret = []
    let node = paragraph.firstChild
    while (node !== null) {
      ret.push(drillDown(node, []))
      node = node.nextSibling
    }
    return ret
  }

  function drillDown(node, effects) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      effects.unshift(getType(node.nodeName))
      return drillDown(node.firstChild, effects)
    } else if (node.nodeType === Node.TEXT_NODE) {
      if (effects.length == 0) {
        return { text: node.textContent }
      }
      return { text: node.textContent, effects }
    }
  }

  function getType(nodeName) {
    for (let prop in rules) {
      if (rules[prop].tag && rules[prop].tag.toUpperCase() === nodeName) {
        return rules[prop]
      }
    }
    throw new Error('Unsupported nodeName: ' + nodeName)
  }
}

export default create
