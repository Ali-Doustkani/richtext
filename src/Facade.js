import { generateRenderModel } from './DOM/Factory'
import stylist_style from './Stylist/Stylist'
import {
  glue as stylist_glue,
  breakAt as stylist_breakAt
} from './Stylist/Break'
import { read } from './DOM/DomReader'
import { el } from './DOM/Query'

function createFacade(rules) {
  return {
    style: (start, end, styleName) =>
      generateRenderModel(
        stylist_style({
          type: rules[styleName],
          input: read(rules, el(document.activeElement)),
          from: start,
          to: end
        })
      ),

    glue: (model1, model2) => generateRenderModel(stylist_glue(model1, model2)),

    breakAt: (model, relativeRange) =>
      stylist_breakAt(model, relativeRange).map(m => generateRenderModel(m))
  }
}

export default createFacade
