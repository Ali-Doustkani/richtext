import { areEqual } from './utils'

function create(result, head) {
  return Object.freeze({
    result: Object.freeze(result || []),
    head: head || 0
  })
}

function addToResult(state, text, effects, active) {
  if (text === '') {
    return state
  }
  const result = [...state.result]
  const lastElement = result[result.length - 1]
  if (lastElement && areEqual(lastElement.effects, effects)) {
    lastElement.text += text
    lastElement.active = active || lastElement.active
  } else {
    if (active && lastElement) {
      lastElement.active = false
    }
    result.push({ text, effects, active })
  }
  return create(result, state.head + text.length)
}

function createContext(from, to) {
  let state = create()
  let regionHead = 0
  const ret = {}

  const mustUndo = (effects, type) => {
    const hasTheEffect = effects.includes(type)
    const regionFitToPoints = state.head === from && regionHead === to
    const pointsAreInRegion =
      from >= state.head &&
      to > state.head &&
      from < regionHead &&
      to <= regionHead
    return hasTheEffect && (regionFitToPoints || pointsAreInRegion)
  }

  ret.result = () => {
    if (state.result.length === 1) {
      state.result[0].active = true
    }
    return state.result
  }

  ret.addResult = (text, effects, active) => {
    state = addToResult(state, text, effects, active)
    return ret
  }

  ret.iterateOver = (input, type, func) => {
    for (let i = 0; i < input.length; i++) {
      const { text, effects } = input[i]
      regionHead += text.length
      func(text, effects, ret.getEffective(effects, type))
    }
  }

  ret.getEffective = (effects, type) =>
    mustUndo(effects, type) ? remove(effects, type) : merge(effects, type)

  ret.regionUntouched = () => {
    return regionHead <= from || state.head >= to
  }

  ret.region0Part = () => {
    return regionHead <= to && state.head >= from
  }

  ret.region3Parts = () => {
    const [head, len] = [state.head, regionHead]
    const leftHandedTrio = head < from && from < len && to <= len
    const rightHandedTrio = head <= from && from < len && to < len
    return leftHandedTrio || rightHandedTrio
  }

  ret.regionFirstEffectiveOf2Parts = () => {
    const first = state.head <= from && regionHead < to
    const second = state.head < from && regionHead <= to
    return first || second
  }

  ret.regionSecondEffectiveOf2Parts = () => {
    const first = from <= state.head && regionHead > to
    const second = from < state.head && regionHead >= to
    return first || second
  }

  ret.threePieces = text => {
    const a = from - state.head
    const b = to - state.head
    return [text.slice(0, a), text.slice(a, b), text.slice(b, text.length)]
  }

  ret.twoPieces = text => {
    const p = state.head <= from && from < regionHead ? from : to
    return [text.slice(0, p - state.head), text.slice(p - state.head)]
  }

  return ret
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
  return [...array.filter(item => !effectsEqual(item, element)), element]
}

function effectsEqual(effect1, effect2) {
  if (effect1 === effect2) {
    return true
  }
  return effect1.tag === effect2.tag && effect1.className === effect2.className
}

export default createContext
