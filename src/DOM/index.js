import { relativeRange as _relativeRange } from './Range'

function relativeRange(editor) {
  return _relativeRange(editor, window.getSelection().getRangeAt(0))
}

export { read } from './DomReader'
export { generateRenderModel, createNewEditor } from './Factory'
export { el } from './Query'
export { render } from './Renderer'
export { absoluteRange } from './Range'
export { relativeRange }
