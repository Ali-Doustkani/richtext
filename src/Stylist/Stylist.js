import createContext from './context'
import { remove, merge, decide } from './utils'

function check(options) {
  if (options) {
    if (typeof options.input === 'string') {
      options.input = [{ text: options.input }]
    }
    return options
  }
  throw new Error('Invalid options')
}

function style(options) {
  const { input, from, to, type } = check(options)
  const context = createContext(from, to)
  context.iterateOver(input, (text, effects) => {
    decide(() => effects === undefined || !effects.includes(type))
      .withArgument({
        points: { from: options.from, to: options.to },
        context,
        text,
        effects,
        type
      })
      .when(context.regionIsUntouched)
      .doWith(passIt)
      .orUndoWith(undo)
      .when(context.regionBeginAndEnds)
      .doWith(affectTheMiddle)
      .orUndoWith(undoMiddle)
      .when(context.regionIsBeginning)
      .doWith(takeTheFirstPart)
      .orUndoWith(undo)
      .when(context.regionInTheMiddle)
      .doWith(waitForNextPart)
      .orUndoWith(undo)
      .when(context.regionIsEnding)
      .doWith(finalizeWithTheSecondPart)
      .orUndoWith(undo)
  })

  return context.flush().result()
}

function undo({ text, effects, type, context }) {
  const effective = merge(effects, type)
  context.flush(effective).addResult(text, effective)
}

function passIt({ text, effects, context }) {
  context.addResult(text, effects)
}

function affectTheMiddle({ points, text, context, effects, type }) {
  const effect = merge(effects, type)
  const [first, middle, last] = threePieces(text, points, context)
  context
    .addResult(first, effects)
    .addResult(middle, effect)
    .addResult(last, effects)
}

function undoMiddle({ points, text, context, effects, type }) {
  const effective = remove(effects, type)
  const [first, middle, last] = threePieces(text, points, context)
  context.flush(effects)
  context
    .addResult(first, effects)
    .addResult(middle, effective)
    .addResult(last, effects)
}

function takeTheFirstPart({ points, text, context }) {
  const [first, second] = twoPieces(text, points.from, context)
  context.addResult(first).buffer(second)
}

function waitForNextPart({ text, context }) {
  context.buffer(text)
}

function finalizeWithTheSecondPart({ points, text, context, effects, type }) {
  const effective = merge(effects, type)
  const [first, second] = twoPieces(text, points.to, context)
  context
    .buffer(first)
    .flush(effective)
    .addResult(second)
}

function twoPieces(item, point, context) {
  return [
    item.slice(0, point - context.head()),
    item.slice(point - context.head())
  ]
}

function threePieces(value, point, context) {
  const from = point.from - context.head()
  const to = point.to - context.head()
  return [
    value.slice(0, from),
    value.slice(from, to),
    value.slice(to, value.length)
  ]
}

style.init = function(options) {
  for (let styleName in options) {
    Object.defineProperty(style, styleName, {
      enumerable: true,
      value: options[styleName]
    })
  }
}

export default style
