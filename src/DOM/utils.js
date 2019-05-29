function effectsAreOk(rules) {
  if (!rules) {
    throw new Error("'rules' cannot be empty")
  }
  for (let prop in rules) {
    if (typeof rules[prop] !== 'object') {
      throw new Error(
        `${prop} must be an object containing 'tag' but it's a ${typeof rules[
          prop
        ]}`
      )
    }
    if (typeof rules[prop].tag !== 'string') {
      throw new Error(`'tag' in ${rules[prop]} is not string`)
    }
    if (!rules[prop]) {
      throw new Error(
        `'tag' in ${rules[prop]} does not have a not empty string value`
      )
    }
  }
}

function standardizeRules(rules) {
  const initObj = {}
  for (let prop in rules) {
    if (typeof rules[prop] === 'string') {
      initObj[prop] = { tag: rules[prop] }
    } else {
      initObj[prop] = rules[prop]
    }
  }
  return initObj
}

/**
 * Generates all the elements in the array as siblings on the parent.
 * The main element that other sibling are added relative to it also exists in this array.
 * @param {HTMLElement} parent
 * @param {Array} elements
 * @param {number} mainElementIndex
 */
function generateSiblings(parent, elements, mainElementIndex) {
  for (let i = mainElementIndex; i > 0; i--) {
    parent.insertBefore(elements[i - 1], elements[i])
  }
  for (let i = mainElementIndex; i < elements.length - 1; i++) {
    parent.insertBefore(elements[i + 1], elements[i + 1].nextSibling)
  }
}

export { effectsAreOk, standardizeRules, generateSiblings }
