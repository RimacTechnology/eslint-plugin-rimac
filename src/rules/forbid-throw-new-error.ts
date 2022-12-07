import { createRule } from '../utils'

const NAME = 'forbid-throw-new-error'

const value = createRule({
    create(context) {
        return {
            Identifier(node) {
                if (node.name === "Error") {
                    context.report({
                        loc: node.loc,
                        messageId: 'default',
                    })
                }
            },
        }
    },
    defaultOptions: [],
    meta: {
        docs: {
            description: 'Prevents throwing default errors',
            recommended: false,
            requiresTypeChecking: false,
        },
        messages: {
            default: 'You must throw a domain specific error',
        },
        schema: [{ additionalProperties: false }],
        type: 'problem',
    },
    name: NAME,
})

export default {
    name: NAME,
    value,
}
