import { areEqual } from './utils'

/**
 * Concats two models.
 * @param {Array} model1
 * @param {Array} model2
 * @returns {Array}       a new model that contains both model1 and model2
 */
function glue(model1, model2) {
  const result = []
  const pushAll = model =>
    model.forEach(item => result.push(copy(item.text, item.decors)))
  pushAll(model1)

  const parentEffect = model1.length
    ? model1[0].decors.find(x => x.parent)
    : null

  model2.forEach(item => {
    item.decors = item.decors.filter(x => !x.parent)
    if (parentEffect) {
      item.decors.push(parentEffect)
    }
  })
  if (result.length && model2.length) {
    const lastEffect = result[result.length - 1].decors
    const firstModel = model2.shift()
    if (areEqual(lastEffect, firstModel.decors)) {
      result[result.length - 1].text += firstModel.text
    } else {
      result.push(copy(firstModel.text, firstModel.decors))
    }
  }
  pushAll(model2)
  setLastActive(result, 0)
  return result
}

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
      originalModel.push(ctx.leftSlice(item))
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
    newModel.push(copy('', originalModel[originalModel.length - 1].decors))
    newModel[0].active = true
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
      copy(item.text.slice(selection.end - read), item.decors),
    leftSlice: item =>
      copy(item.text.slice(0, selection.start - read), item.decors),
    whole: item => copy(item.text, item.decors)
  }
  model.forEach(item => {
    read += item.text.length
    func(item, iterationContext)
  })
}

function copy(text, decors) {
  return { text, decors: [...decors], active: false }
}

function setLastActive(array, index) {
  if (array.length) {
    array[index].active = true
  } else {
    array.push({ text: '', decors: [], active: true })
  }
}

export { breakAt, glue }
