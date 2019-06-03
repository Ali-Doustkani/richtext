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
  return _breakAt(model, relativeRange).map(m => generateRenderModel(m))
}

export { style, glue, breakAt }
