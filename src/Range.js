/**
 * Calculates the selection range relative to the parent element.
 * @param {HTMLElement} rootNode All the points are calculated relative to this element.
 * @param {Range} range The document range object.
 * @returns {object} The result object containing a 'start' and 'end' prop.
 */
function relativeRange(rootNode, range) {
  if (!rootNode) {
    rootNode = range.commonAncestorContainer
  }

  if (rootNode.nodeType !== Node.TEXT_NODE && !rootNode.childNodes.length) {
    return { start: 0, end: 0 }
  }

  let node = firstText(rootNode),
    startOffset = 0,
    enoughReadingForStart = false,
    endOffset = 0

  const incrementEndOffset = node => (endOffset += node.textContent.length)
  const incrementStartOffset = node => {
    if (node === range.startContainer) {
      enoughReadingForStart = true
    }
    if (!enoughReadingForStart) {
      startOffset += node.textContent.length
    }
  }

  while (node !== range.endContainer) {
    incrementEndOffset(node)
    incrementStartOffset(node)
    node = nextText(node)
  }

  return {
    start: startOffset + range.startOffset,
    end: endOffset + range.endOffset
  }
}

function firstText(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node
  }
  return firstText(node.firstChild)
}

function nextText(node) {
  if (node.nextSibling !== null) {
    if (node.nextSibling.nodeType === Node.TEXT_NODE) {
      return node.nextSibling
    } else {
      return firstText(node.nextSibling.firstChild)
    }
  }
  return nextText(node.parentNode)
}

export default relativeRange
