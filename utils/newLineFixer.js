module.exports = function newLineFixer({
  fixer,
  source,
  lineDiff,
  expectedLineDiff,
  newLinesCount,
  node,
  prevNode,
}) {
  if (lineDiff > expectedLineDiff) {
    const range = [
      source.getIndexFromLoc({ line: prevNode.loc.end.line + 1, column: 0 }),
      source.getIndexFromLoc({ line: node.startLine, column: 0 }),
    ];

    return fixer.replaceTextRange(
      range,
      '\n'.repeat(newLinesCount),
    );
  }

  return fixer.insertTextAfter(
    prevNode,
    '\n'.repeat(expectedLineDiff - lineDiff),
  );
}