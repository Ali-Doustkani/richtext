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

// remove the element from array
function remove(array, element) {
  return array.filter(item => item !== element)
}

// add the element to array if it's not already there
function merge(array, element) {
  if (!array) {
    return [element]
  }
  return [...array.filter(item => item !== element), element]
}

function merge2(array, element) {
  if (!array) {
    return [element]
  }
  if (array.includes(element)) {
    return [...array.filter(item => item !== element)]
  }
  return [...array.filter(item => item !== element), element]
}

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

export { remove, merge, merge2, areEqual, when }
