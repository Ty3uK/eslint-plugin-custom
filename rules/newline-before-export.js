const getLineDifference = require('../utils/getLineDifference');
const newLineFixer = require('../utils/newLineFixer');

module.exports = {
  meta: {
    type: 'layout',
    schema: [
      {
        'type': 'object',
        'properties': {
          'count': {
            'type': 'integer',
            'minimum': 1,
          },
        },
        'additionalProperties': false,
      },
    ],
    fixable: 'whitespace',
  },
  create: (context) => {
    const checkForNewLine = (node, prevNode) => {
      const source = context.getSourceCode();
      const options = context.options[0] || { count: 1 };
      const lineDiff = getLineDifference(node, prevNode);
      const expectedLineDiff = options.count + 1;

      if (lineDiff === expectedLineDiff) {
        return;
      }

      context.report({
        loc: {
          line: node.loc.start.line,
          column: 0,
        },
        message: `Expected ${options.count} empty line${options.count > 1 ? 's' : ''} before export statement.`,
        fix: (fixer) => newLineFixer({
          fixer,
          source,
          lineDiff,
          expectedLineDiff,
          node,
          prevNode,
          newLinesCount: options.count,
        }),
      });
    }

    const checkExport = (node) => {
      const { parent } = node
      const nodePosition = parent.body.indexOf(node);
      const prevNode = parent.body[nodePosition - 1];

      if (prevNode) {
        checkForNewLine(node, prevNode);
      }
    }

    return {
      ExportDefaultDeclaration: checkExport,
      ExportNamedDeclaration: checkExport,
    };
  },
};