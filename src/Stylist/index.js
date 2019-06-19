import { style as _style } from './Stylist'
import { glue as _glue, breakAt as _breakAt } from './Break'
import { generateRenderModel, read } from './../DOM'
import { relativeRange } from './../Ranging'

function style(effects, range, styleName, editor) {
  const ef = typeof styleName === 'string' ? effects[styleName] : styleName
  return generateRenderModel(
    _style({
      type: ef,
      input: read(effects, editor),
      range
    })
  )
}

function glue(effects, editor1, editor2) {
  return generateRenderModel(
    _glue(read(effects, editor1), read(effects, editor2))
  )
}

function breakAt(effects, editor) {
  const [m1, m2] = _breakAt(read(effects, editor), relativeRange(editor)).map(
    m => generateRenderModel(m)
  )
  return {
    list: [...m1.list, ...m2.list],
    active: m2.active
  }
}

export { style, glue, breakAt }
