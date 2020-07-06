module.exports = function getLineDifference(node, prevNode) {
  return node.loc.start.line - prevNode.loc.end.line;
}