import createContext from './context'
import { merge, merge2, remove } from './utils'

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
    const arg = {
      points: { from: options.from, to: options.to },
      context,
      text,
      effects,
      type,
      undo: context.undoable(effects, type)
    }
    if (context.regionUntouched()) {
      dontTouch(arg)
    } else if (context.region0Part()) {
      takeAll(arg)
    } else if (context.region3Parts()) {
      takeMiddlePart(arg)
    } else if (context.regionFirstEffectiveOf2Parts()) {
      takeFirstPart(arg)
    } else if (context.regionSecondEffectiveOf2Parts()) {
      takeSecondPart(arg)
    }
  })

  return context.flush().result()
}

function dontTouch({ text, effects, context }) {
  context.addResult(text, effects)
}

function takeAll({ text, effects, type, context, undo }) {
  let effective
  if (undo) {
    effective = remove(effects, type)
  } else {
    effective = merge(effects, type)
  }
  context.flush(effective).addResult(text, effective)
}

function takeMiddlePart({ points, text, context, effects, type, undo }) {
  const effective = merge2(effects, type)
  const [first, middle, last] = threePieces(text, points, context)
  context
    .addResult(first, effects)
    .addResult(middle, effective)
    .addResult(last, effects)
}

function takeFirstPart({ points, text, effects, context }) {
  const [first, second] = twoPieces(text, points.from, context)
  context.addResult(first, effects).buffer(second)
}

function takeSecondPart({
  points,
  text,
  context,
  effects,
  type,
  undo
}) {
  let effective
  if (undo) {
    effective = remove(effects, type)
  } else {
    effective = merge(effects, type)
  }
  const [first, second] = twoPieces(text, points.to, context)
  context
    .buffer(first)
    .flush(effective)
    .addResult(second, effects)
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
