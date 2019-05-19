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

function firstText(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node
  }
  return firstText(node.firstChild)
}

function selectionPoints(rootNode) {
  const sel = window.getSelection().getRangeAt(0)

  if (rootNode === undefined) {
    rootNode = sel.commonAncestorContainer
  }

  let node = firstText(rootNode),
    startOffset = 0,
    enoughReadingForStart = false,
    endOffset = 0

  const incrementEndOffset = node => (endOffset += node.textContent.length)
  const incrementStartOffset = node => {
    if (node === sel.startContainer) {
      enoughReadingForStart = true
    }
    if (!enoughReadingForStart) {
      startOffset += node.textContent.length
    }
  }

  while (node !== sel.endContainer) {
    incrementEndOffset(node)
    incrementStartOffset(node)
    node = nextText(node)
  }

  return {
    start: startOffset + sel.startOffset,
    end: endOffset + sel.endOffset
  }
}

export { selectionPoints }
