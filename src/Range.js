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
    node = nextText(node, rootNode)
  }

  return {
    start: startOffset + range.startOffset,
    end: endOffset + range.endOffset
  }
}

/**
 * Generates an absolute range object that is ready to use with Range API.
 * @param {HTMLElement} rootNode The starting point will be calculated relative to this node.
 * @param {object} selection Relative selection object with 'start' and 'end'.
 */
function absoluteRange(rootNode, selection) {
  if (!rootNode) {
    throw new Error("'rootNode' is required")
  }
  if (selection.start > selection.end) {
    throw new Error('The start point must comes before the end point')
  }

  if (!rootNode.firstChild) {
    return {
      startContainer: rootNode,
      startOffset: 0,
      endContainer: rootNode,
      endOffset: 0
    }
  }

  let node = firstText(rootNode),
    read = 0,
    startContainer,
    endContainer,
    startOffset,
    endOffset
  while (!startContainer || !endContainer) {
    read += node.data.length
    const r = read - node.data.length
    if (!startContainer && read >= selection.start) {
      startContainer = node
      startOffset = selection.start - r
    }
    if (read >= selection.end) {
      endContainer = node
      endOffset = selection.end - r
    }
    node = nextText(node, rootNode)
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
  if (node.nodeType === Node.TEXT_NODE) {
    return node
  }
  return firstText(node.firstChild)
}

// navigate the entire tree under 'rootNode' until a text node is found
function nextText(node, rootNode) {
  if (node.nextSibling !== null) {
    if (node.nextSibling.nodeType === Node.TEXT_NODE) {
      return node.nextSibling
    } else {
      return firstText(node.nextSibling.firstChild)
    }
  }
  if (node.parentNode === rootNode) {
    return null
  }
  return nextText(node.parentNode, rootNode)
}

export { relativeRange, absoluteRange }
