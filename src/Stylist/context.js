import { areEqual } from './utils'

function create(result, head, buffered) {
  return Object.freeze({
    result: Object.freeze(result || []),
    head: head || 0,
    buffered: buffered || ''
  })
}

function addToResult(state, text, effect) {
  if (text !== '') {
    const head = state.head + text.length
    return mergeResult({ ...state, head }, text, effect)
  }
  return state
}

function mergeResult(state, text, effects) {
  const result = [...state.result]
  const lastElement = result[result.length - 1]
  if (lastElement && areEqual(lastElement.effects, effects)) {
    lastElement.text += text
  } else {
    if (effects && effects.length) {
      result.push({ text, effects })
    } else {
      result.push({ text })
    }
  }
  return create(result, state.head, state.buffered)
}

// a fluent representation of this module
function createContext(from, to) {
  let state = create()
  let readLength = 0
  let currentTextLength = 0
  const ret = {}
  ret.head = () => state.head
  ret.result = () => state.result

  ret.addResult = (text, effects) => {
    state = addToResult(state, text, effects)
    return ret
  }
  ret.iterateOver = function(array, func) {
    for (let i = 0; i < array.length; i++) {
      const { text, effects } = array[i]
      currentTextLength = text.length
      readLength += currentTextLength
      func(text, effects, readLength)
    }
  }
  ret.regionUntouched = () => {
    return readLength <= from || state.head >= to
  }
  ret.region0Part = () => {
    return readLength <= to && state.head >= from
  }
  ret.undoable = (effects, type) => {
    return (
      state.head === from &&
      readLength === to &&
      effects &&
      effects.includes(type)
    )
  }
  ret.region3Parts = () => {
    const [head, len] = [state.head, readLength]
    const leftHandedTrio = head < from && from < len && to <= len
    const rightHandedTrio = head <= from && from < len && to < len
    return leftHandedTrio || rightHandedTrio
  }
  ret.regionFirstEffectiveOf2Parts = () => {
    const first = state.head <= from && readLength < to
    const second = state.head < from && readLength <= to
    return first || second
  }
  ret.regionSecondEffectiveOf2Parts = () => {
    const first = from <= state.head && readLength > to
    const second = from < state.head && readLength >= to
    return first || second
  }
 
  return ret
}

export default createContext
