module.exports = function getLineDifference(node, prevNode) {
  return node.startLine - prevNode.loc.end.line;
}