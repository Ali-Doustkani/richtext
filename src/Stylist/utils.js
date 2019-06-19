function when(condition) {
  const conditions = [condition]
  const results = []
  const otherwiseObj = {
    otherwise: condition => {
      conditions.push(condition)
      return thenObj
    },
    run: arg => {
      if (conditions.length !== results.length) {
        throw new Error(
          'there must be equal number of "when expressions" and "then expressions"'
        )
      }
      for (let i = 0; i < conditions.length; i++) {
        if (conditions[i]()) {
          results[i](arg)
          break
        }
      }
    }
  }
  const thenObj = {
    then: result => {
      results.push(result)
      return otherwiseObj
    }
  }
  return thenObj
}

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

export { when, areEqual }
