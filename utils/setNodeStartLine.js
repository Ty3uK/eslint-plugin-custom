module.exports = function setNodeStartLine(node) {
    const comments = node.leadingComments || (node.ast && node.ast.comments) || [];
    const startLine = Math.min(
        node.loc.start.line,
        ...comments.map(c => c.loc.start.line)
    ) || 0;
    node.startLine = startLine;
}