import createContext from './iterationContext'
import { when } from './utils'

function check(options) {
  if (options) {
    if (typeof options.input === 'string') {
      options.input = [{ text: options.input }]
    } else if (
      typeof options.input === 'object' &&
      !Array.isArray(options.input)
    ) {
      options.input = [options.input]
    }
    return options
  }
  throw new Error('Invalid options')
}

function style(options) {
  const { input, from, to, type } = check(options)
  const context = createContext(from, to)
  if (emptyInput(options)) {
    return [{ text: '', effects: context.getEffective(input[0].effects, type) }]
  }
  context.iterateOver(input, type, (text, originalEffects, newEffects) => {
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
      .run({ context, text, originalEffects, newEffects })
  })

  return context.result()
}

function emptyInput(options) {
  const { input, from, to } = options
  const noInput = input.length === 1 && !input[0].text
  return noInput && !from && !to
}

function dontTouch({ context, text, originalEffects }) {
  context.addResult(text, originalEffects)
}

function takeAll({ context, text, newEffects }) {
  context.addResult(text, newEffects)
}

function takeMiddlePart({ context, text, originalEffects, newEffects }) {
  const [first, middle, last] = context.threePieces(text)
  context
    .addResult(first, originalEffects)
    .addResult(middle, newEffects)
    .addResult(last, originalEffects)
}

function takeFirstPart({ context, text, originalEffects, newEffects }) {
  const [first, second] = context.twoPieces(text)
  context.addResult(first, originalEffects).addResult(second, newEffects)
}

function takeSecondPart({ context, text, originalEffects, newEffects }) {
  const [first, second] = context.twoPieces(text)
  context.addResult(first, newEffects).addResult(second, originalEffects)
}

export default style
