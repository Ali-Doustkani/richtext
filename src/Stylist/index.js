import { style as _style } from './Stylist'
import { glue as _glue, breakAt as _breakAt } from './Break'
import { generateRenderModel, read } from './../DOM'
import { relativeRange } from './../Ranging'

function style(decors, range, styleName, editor) {
  const ef = typeof styleName === 'string' ? decors[styleName] : styleName
  return generateRenderModel(
    _style({
      type: ef,
      input: read(decors, editor),
      range
    })
  )
}

function glue(decors, editor1, editor2) {
  return generateRenderModel(
    _glue(read(decors, editor1), read(decors, editor2))
  )
}

function breakAt(decors, editor) {
  const [m1, m2] = _breakAt(read(decors, editor), relativeRange(editor)).map(
    m => generateRenderModel(m)
  )
  return {
    list: [...m1.list, ...m2.list],
    active: m2.active
  }
}

export { style, glue, breakAt }
