import { relativeRange as _relativeRange } from './RangeComputer'

function relativeRange(editor) {
  return _relativeRange(editor, window.getSelection().getRangeAt(0))
}

export { relativeRange }
export { absoluteRange } from './RangeComputer'
export { CursorRange } from './Range'
