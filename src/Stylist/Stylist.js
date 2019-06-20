import createContext from './iterationContext'
import { when } from './utils'

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
  context.iterateOver(input, type, (text, originalDecors, newDecors) => {
    when(context.regionUntouched)
      .then(dontTouch)
      .otherwise(context.region0Part)
      .then(takeAll)
      .otherwise(context.region3Parts)
      .then(takeMiddlePart)
      .otherwise(context.regionFirstEffectiveOf2Parts)
      .then(takeFirstPart)
      .otherwise(context.regionSecondEffectiveOf2Parts)
      .then(takeSecondPart)
      .run({ context, text, originalDecors, newDecors })
  })

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
