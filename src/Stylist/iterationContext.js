import { areEqual } from './utils'

function create(result, head) {
  return Object.freeze({
    result: Object.freeze(result || []),
    head: head || 0
  })
}

function addToResult(state, text, decors, active) {
  if (text === '') {
    return state
  }
  const result = [...state.result]
  const lastElement = result[result.length - 1]
  if (lastElement && areEqual(lastElement.decors, decors)) {
    lastElement.text += text
    lastElement.active = active || lastElement.active
  } else {
    if (active && lastElement) {
      lastElement.active = false
    }
    result.push({ text, decors, active })
  }
  return create(result, state.head + text.length)
}

function createContext({ start, end }) {
  let state = create()
  let regionHead = 0
  const ret = {}

  const mustUndo = (decors, type) => {
    const hasTheDecor = decors.includes(type)
    const regionFitToPoints = state.head === start && regionHead === end
    const pointsAreInRegion =
      start >= state.head &&
      end > state.head &&
      start < regionHead &&
      end <= regionHead
    return hasTheDecor && (regionFitToPoints || pointsAreInRegion)
  }

  ret.result = () => {
    if (state.result.length === 1) {
      state.result[0].active = true
    }
    return state.result
  }

  ret.addResult = (text, decors, active) => {
    state = addToResult(state, text, decors, active)
    return ret
  }

  ret.iterateOver = (input, type, func) => {
    for (let i = 0; i < input.length; i++) {
      const { text, decors } = input[i]
      regionHead += text.length
      func(text, decors, ret.getEffective(decors, type))
    }
  }

  ret.getEffective = (decors, type) =>
    mustUndo(decors, type) ? remove(decors, type) : merge(decors, type)

  ret.regionUntouched = () => {
    return regionHead <= start || state.head >= end
  }

  ret.region0Part = () => {
    return regionHead <= end && state.head >= start
  }

  ret.region3Parts = () => {
    const [head, len] = [state.head, regionHead]
    const leftHandedTrio = head < start && start < len && end <= len
    const rightHandedTrio = head <= start && start < len && end < len
    return leftHandedTrio || rightHandedTrio
  }

  ret.regionFirstEffectiveOf2Parts = () => {
    const first = state.head <= start && regionHead < end
    const second = state.head < start && regionHead <= end
    return first || second
  }

  ret.regionSecondEffectiveOf2Parts = () => {
    const first = start <= state.head && regionHead > end
    const second = start < state.head && regionHead >= end
    return first || second
  }

  ret.threePieces = text => {
    const a = start - state.head
    const b = end - state.head
    return [text.slice(0, a), text.slice(a, b), text.slice(b, text.length)]
  }

  ret.twoPieces = text => {
    const p = state.head <= start && start < regionHead ? start : end
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
  return [...array.filter(item => !decorsEqual(item, element)), element]
}

function decorsEqual(decor1, decor2) {
  if (decor1 === decor2) {
    return true
  }
  return decor1.tag === decor2.tag && decor1.className === decor2.className
}

export default createContext
