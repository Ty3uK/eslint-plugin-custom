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
    const source = context.getSourceCode();
    const options = context.options[0] || { count: 1 };
    const expectedLineDiff = options.count + 1;

    return {
      ClassBody(node) {
        node.body.forEach((subNode, index) => {
          if (subNode.type !== 'MethodDefinition') {
            return;
          }

          const prevSubNode = node.body[index - 1];

          if (!prevSubNode) {
            return;
          }

          const lineDiff = getLineDifference(subNode, prevSubNode);

          if (lineDiff === expectedLineDiff) {
            return;
          }

          context.report({
            loc: {
              line: subNode.loc.start.line,
              column: 0,
            },
            message: `Expected ${options.count} empty line${options.count > 1 ? 's' : ''} before method.`,
            fix: (fixer) => newLineFixer({
              fixer,
              source,
              lineDiff,
              expectedLineDiff,
              newLinesCount: options.count,
              node: subNode,
              prevNode: prevSubNode,
            }),
          });
        });
      }
    };
  },
};