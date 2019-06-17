/**
 * Travereses the tree in Pre-Order.
 * @param {QuertyElement} node
 */
function traverse(node) {
  const result = []
  go(node, result)
  return result
}

function go(node, leafs) {
  if (!node) {
    return
  }
  if (node.is(Node.TEXT_NODE)) {
    leafs.push(node)
    return
  }
  if (!node.hasChildren()) {
    leafs.push(node)
    return
  }
  node.forChildren(child => go(child, leafs))
}

export { traverse }
