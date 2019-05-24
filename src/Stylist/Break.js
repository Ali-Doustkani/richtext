function breakAt(model, selection) {
  const originalModel = [],
    newModel = []
  if (typeof selection === 'number') {
    selection = { start: selection, end: selection }
  }

  iterateOver(model, selection, (item, ctx) => {
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
  if (!effects) {
    return { text }
  }
  return { text, effects: [...effects] }
}

export default breakAt 
