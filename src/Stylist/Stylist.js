import createContext from './iterationContext'
import { cond } from './../Fns'

function check(options) {
  if (options) {
    if (typeof options.input === 'string') {
      options.input = [{ text: options.input, decors: [] }]
    } else if (
      typeof options.input === 'object' &&
      !Array.isArray(options.input)
    ) {
      options.input = [options.input]
    }
    options.input.forEach(item => (item.decors = item.decors || []))
    return options
  }
  throw new Error('Invalid options')
}

/**
 * Creates a flat model of a styled text.
 * @param {object} options It contains 'input', 'range', and 'type'
 */
function style(options) {
  const { input, range, type } = check(options)
  const context = createContext(range)
  if (emptyInput(options)) {
    return [
      {
        text: '',
        decors: context.getEffective(input[0].decors, type),
        active: true
      }
    ]
  }
  context.iterateOver(input, type, (text, originalDecors, newDecors) =>
    cond([
      [context.regionUntouched, dontTouch],
      [context.region0Part, takeAll],
      [context.region3Parts, takeMiddlePart],
      [context.regionFirstEffectiveOf2Parts, takeFirstPart],
      [context.regionSecondEffectiveOf2Parts, takeSecondPart]
    ])({ context, text, originalDecors, newDecors })
  )
  return context.result()
}

function emptyInput(options) {
  const { input, range } = options
  const noInput = input.length === 1 && !input[0].text
  return noInput && !range.start && !range.end
}

function dontTouch({ context, text, originalDecors }) {
  context.addResult(text, originalDecors, false)
}

function takeAll({ context, text, newDecors }) {
  context.addResult(text, newDecors, true)
}

function takeMiddlePart({ context, text, originalDecors, newDecors }) {
  const [first, middle, last] = context.threePieces(text)
  context
    .addResult(first, originalDecors, false)
    .addResult(middle, newDecors, true)
    .addResult(last, originalDecors, false)
}

function takeFirstPart({ context, text, originalDecors, newDecors }) {
  const [first, second] = context.twoPieces(text)
  context
    .addResult(first, originalDecors, false)
    .addResult(second, newDecors, true)
}

function takeSecondPart({ context, text, originalDecors, newDecors }) {
  const [first, second] = context.twoPieces(text)
  context
    .addResult(first, newDecors, true)
    .addResult(second, originalDecors, false)
}

export { style }
