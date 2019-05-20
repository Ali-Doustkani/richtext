// if 'when' expression is true then run the 'doWith' or 'undoWith' based 'decide' expression result
function decide(test) {
  let ran = false
  let theArg = undefined
  const takeValue = test()
  const ifObj = {}
  ifObj.when = func => {
    const ifResult = func()
    return {
      doWith: doFunc => {
        if (!ran && takeValue && ifResult) {
          ran = true
          doFunc(theArg)
        }
        return {
          orUndoWith: undoFunc => {
            if (!ran && !takeValue && ifResult) {
              ran = true
              undoFunc(theArg)
            }
            return ifObj
          }
        }
      }
    }
  }
  return {
    withArgument: arg => {
      theArg = arg
      return ifObj
    }
  }
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

export { remove, merge,merge2,  areEqual, decide }
