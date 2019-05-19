import { areEqual } from './utils'

function create(result, head, buffered) {
  return Object.freeze({
    result: Object.freeze(result || []),
    head: head || 0,
    buffered: buffered || ''
  })
}

function addToBuffer(state, text) {
  return create(state.result, state.head + text.length, state.buffered + text)
}

function addToResult(state, text, effect) {
  if (text !== '') {
    const head = state.head + text.length
    return mergeResult({ ...state, head }, text, effect)
  }
  return state
}

function flushBuffer(state, effect) {
  if (state.buffered !== '') {
    const merged = mergeResult(state, state.buffered, effect)
    return create(merged.result, merged.head, '')
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
  ret.buffer = text => {
    state = addToBuffer(state, text)
    return ret
  }
  ret.addResult = (text, effects) => {
    state = addToResult(state, text, effects)
    return ret
  }
  ret.flush = effect => {
    state = flushBuffer(state, effect)
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
  ret.regionIsUntouched = function() {
    return readLength < from || state.head >= to
  }
  ret.regionBeginAndEnds = function() {
    return state.head <= from && state.head >= to - currentTextLength
  }
  ret.regionIsBeginning = function() {
    return readLength <= to && state.head < from
  }
  ret.regionInTheMiddle = function() {
    return readLength <= to && state.head >= from
  }
  ret.regionIsEnding = function() {
    return readLength > to
  }
  return ret
}

export default createContext