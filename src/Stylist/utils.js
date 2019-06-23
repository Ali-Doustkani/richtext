/**
 * Checks the equality of two different decor arrays.
 * @param {Array} first   First decors array.
 * @param {Array} second  Second decors array.
 * @returns {boolean}     If they are equal returns true, otherwise false.
 */
function areEqual(first, second) {
  // if they are empty array set them to undefined
  first = first && first.length ? first : undefined
  second = second && second.length ? second : undefined

  // if any of them is undefined compare them directly
  if (!first || !second) {
    return first === second
  }
  if (first.length !== second.length) {
    return false
  }
  return first.every(item => second.includes(item))
}

export { areEqual }
