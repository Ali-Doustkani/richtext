import { areEqual } from './utils'

/**
 * Splits the model into two different models.
 * @param {Array} model The model which will be broke into two different models.
 * @param {object} range The relative range object that specifies the breaking point.
 * @returns {Array} Returns an array containing two items, which are new models.
 */
function breakAt(model, range) {
  const originalModel = [],
    newModel = []
  if (typeof range === 'number') {
    range = { start: range, end: range }
  }

  iterateOver(model, range, (item, ctx) => {
    if (ctx.notStartedYet()) {
      originalModel.push(ctx.whole(item))
    } else if (ctx.starting()) {
      const copied = ctx.leftSlice(item)
      if (copied.text) {
        originalModel.push(copied)
      }
      if (ctx.justEnter()) {
        newModel.push(ctx.rightSlice(item))
      }
    } else if (ctx.ending()) {
      newModel.push(ctx.rightSlice(item))
    } else if (ctx.ended()) {
      newModel.push(ctx.whole(item))
    }
  })

  if (newModel.length) {
    newModel[newModel.length - 1].active = true
  } else {
    newModel.push({ text: '', active: true })
  }

  return [originalModel, newModel]
}

function iterateOver(model, selection, func) {
  let read = 0,
    started = false,
    ended = false

  const iterationContext = {
    notStartedYet: () => read <= selection.start,
    starting: () => {
      const result = !started && read > selection.start
      if (result) {
        started = true
      }
      return result
    },
    ended: () => ended,
    ending: () => {
      const result = started && !ended && read > selection.end
      if (result) {
        ended = true
      }
      return result
    },
    justEnter: () => {
      const result = selection.start === selection.end || read > selection.end
      if (result) {
        ended = true
      }
      return result
    },
    rightSlice: item =>
      copy(item.text.slice(selection.end - read), item.effects),
    leftSlice: item =>
      copy(item.text.slice(0, selection.start - read), item.effects),
    whole: item => copy(item.text, item.effects)
  }
  model.forEach(item => {
    read += item.text.length
    func(item, iterationContext)
  })
}

function copy(text, effects) {
  if (!effects || !effects.length) {
    return { text, active: false }
  }
  return { text, effects: [...effects], active: false }
}

/**
 * Concats two models.
 * @param {Array} model1
 * @param {Array} model2
 * @returns {Array}       a new model that contains both model1 and model2
 */
function glue(model1, model2) {
  const result = []
  const push = item => {
    const effects =
      item.effects && item.effects.length
        ? item.effects.filter(x => !x.parent)
        : undefined
    result.push(copy(item.text, effects))
  }
  model1.forEach(push)
  if (result.length && model2.length) {
    const lastEffect = result[result.length - 1].effects
    const firstModel = model2.shift()
    if (areEqual(lastEffect, firstModel.effects)) {
      result[result.length - 1].text += firstModel.text
    } else {
      push(firstModel)
    }
  }
  model2.forEach(push)
  result[result.length - 1].active = true
  return result
}

export { breakAt, glue }
