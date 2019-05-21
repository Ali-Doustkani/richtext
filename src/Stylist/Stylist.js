import createContext from './context'
import { merge, merge2, remove, when } from './utils'

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
  context.iterateOver(input, (text, effects) => {
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
      .run({ context, text, effects, type })
  })

  return context.result()
}

function dontTouch({ context, text, effects }) {
  context.addResult(text, effects)
}

function takeAll({ context, text, effects, type }) {
  const effective = context.mustUndo(effects, type)
    ? remove(effects, type)
    : merge(effects, type)
  context.addResult(text, effective)
}

function takeMiddlePart({ context, text, effects, type }) {
  const effective = merge2(effects, type)
  const [first, middle, last] = context.threePieces(text)
  context
    .addResult(first, effects)
    .addResult(middle, effective)
    .addResult(last, effects)
}

function takeFirstPart({ context, text, effects, type }) {
  const [first, second] = context.twoPieces(text)
  const effective = merge(effects, type)
  context.addResult(first, effects).addResult(second, effective)
}

function takeSecondPart({ context, text, effects, type }) {
  const effective = context.mustUndo(effects, type)
    ? remove(effects, type)
    : merge(effects, type)
  const [first, second] = context.twoPieces(text)
  context.addResult(first, effective).addResult(second, effects)
}

style.init = options => {
  for (let styleName in options) {
    Object.defineProperty(style, styleName, {
      enumerable: true,
      value: options[styleName]
    })
  }
}

export default style
