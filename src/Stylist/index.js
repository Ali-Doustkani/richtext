import { style as _style } from './Stylist'
import { glue as _glue, breakAt as _breakAt } from './Break'
import { generateRenderModel, el, read } from './../DOM'

function style(effects, start, end, styleName) {
  return generateRenderModel(
    _style({
      type: effects[styleName],
      input: read(effects, el(document.activeElement)),
      from: start,
      to: end
    })
  )
}

function glue(model1, model2) {
  return generateRenderModel(_glue(model1, model2))
}

function breakAt(model, relativeRange) {
  const [m1, m2] = _breakAt(model, relativeRange).map(m =>
    generateRenderModel(m)
  )
  return {
    list: [...m1.list, ...m2.list],
    active: m2.active
  }
}

export { style, glue, breakAt }
