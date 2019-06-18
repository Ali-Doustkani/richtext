import { el } from '../DOM/Query'
import { CursorRange } from './Range'

/**
 * Calculates the selection range relative to the parent element.
 * @param {QueryElement} rootEl All the points are calculated relative to this element.
 * @param {Range} docRange The document range object.
 * @returns {CursorRange} The result object containing a 'start' and 'end' prop.
 */
function relativeRange(rootEl, docRange) {
  if (!rootEl) {
    rootEl = el(docRange.commonAncestorContainer)
  }

  if (rootEl.isNot(Node.TEXT_NODE) && rootEl.hasNoChildren()) {
    return CursorRange.empty()
  }

  let node = firstText(rootEl),
    startOffset = 0,
    enoughReadingForStart = false,
    endOffset = 0

  const incrementEndOffset = node => (endOffset += node.textLength)
  const incrementStartOffset = node => {
    if (node.is(docRange.startContainer)) {
      enoughReadingForStart = true
    }
    if (!enoughReadingForStart) {
      startOffset += node.textLength
    }
  }

  while (node.isNot(docRange.endContainer)) {
    incrementEndOffset(node)
    incrementStartOffset(node)
    node = nextText(node, rootEl)
    if (node === null) {
      break
    }
  }

  return new CursorRange(
    startOffset + docRange.startOffset,
    endOffset + docRange.endOffset
  )
}

/**
 * Generates an absolute range object that is ready to use with Range API.
 * @param {QueryElement} rootEl The starting point will be calculated relative to this node.
 * @param {object} selection Relative selection object with 'start' and 'end'.
 */
function absoluteRange(rootEl, selection) {
  if (!rootEl) {
    throw new Error("'rootNode' is required")
  }
  if (selection.start > selection.end) {
    throw new Error('The start point must comes before the end point')
  }

  if (!rootEl.firstChild()) {
    return {
      startContainer: rootEl.element,
      startOffset: 0,
      endContainer: rootEl.element,
      endOffset: 0
    }
  }

  let node = firstText(rootEl),
    read = 0,
    startContainer,
    endContainer,
    startOffset,
    endOffset
  while (!startContainer || !endContainer) {
    read += node.textLength
    const r = read - node.textLength
    if (!startContainer && read >= selection.start) {
      startContainer = node.element
      startOffset = selection.start - r
    }
    if (read >= selection.end) {
      endContainer = node.element
      endOffset = selection.end - r
    }
    node = nextText(node, rootEl)
  }
  return {
    startContainer,
    startOffset,
    endContainer,
    endOffset
  }
}

// dig the tree until a text node is found
function firstText(node) {
  if (node.is(Node.TEXT_NODE)) {
    return node
  }
  return firstText(node.firstChild())
}

// navigate the entire tree under 'rootNode' until a text node is found
function nextText(node, rootEl) {
  if (node.next() !== null) {
    if (node.next().is(Node.TEXT_NODE)) {
      return node.next()
    } else {
      return firstText(node.next().firstChild())
    }
  }
  if (node.parent() && node.parent().is(rootEl)) {
    return null
  }
  return nextText(node.parent(), rootEl)
}

export { relativeRange, absoluteRange }
