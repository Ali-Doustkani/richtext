import { areEqual } from './utils'

function create(result, head) {
  return Object.freeze({
    result: Object.freeze(result || []),
    head: head || 0
  })
}

function addToResult(state, text, effects) {
  if (text === '') {
    return state
  }
  effects = effects && effects.length ? effects : undefined // empty array is not acceptable
  const result = [...state.result]
  const lastElement = result[result.length - 1]
  if (lastElement && areEqual(lastElement.effects, effects)) {
    lastElement.text += text
  } else {
    result.push({ text, effects })
  }
  return create(result, state.head + text.length)
}

function createContext(from, to) {
  let state = create()
  let readLength = 0
  const ret = {}

  ret.head = () => state.head

  ret.result = () => state.result

  ret.addResult = (text, effects) => {
    state = addToResult(state, text, effects)
    return ret
  }

  ret.iterateOver = (array, func) => {
    for (let i = 0; i < array.length; i++) {
      const { text, effects } = array[i]
      readLength += text.length
      func(text, effects, readLength)
    }
  }

  ret.regionUntouched = () => {
    return readLength <= from || state.head >= to
  }

  ret.region0Part = () => {
    return readLength <= to && state.head >= from
  }

  ret.mustUndo = (effects, type) => {
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

  ret.threePieces = text => {
    const a = from - state.head
    const b = to - state.head
    return [text.slice(0, a), text.slice(a, b), text.slice(b, text.length)]
  }

  ret.twoPieces = text => {
    const p = state.head <= from && from < readLength ? from : to
    return [text.slice(0, p - state.head), text.slice(p - state.head)]
  }

  return ret
}

export default createContext
