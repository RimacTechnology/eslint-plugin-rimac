import { createRule } from '../utils'

const NAME = 'document-todos'

const value = createRule<Record<string, string>[], string>({
    create(context) {
        return {
            Program() {
                const url = context.options[0]?.url

                if (!url) {
                    throw new Error(`URL not set for the ${NAME} rule. Please set the URL.`)
                }

                const sourceCode = context.getSourceCode()
                const comments = sourceCode.getAllComments()

                for (const comment of comments) {
                    const isTodo = comment.value.includes('TODO:')
                    const isFixme = comment.value.includes('FIXME:')
                    const hasLink = comment.value.includes(url.toLowerCase())

                    const startsWithTodo = comment
                        .value
                        .trimStart()
                        .toLowerCase()
                        .startsWith('todo')

                    const startsWithFixme = comment
                        .value
                        .trimStart()
                        .toLowerCase()
                        .startsWith('fixme')

                    // Valid todo/fixme comment
                    if ((isTodo || isFixme || startsWithFixme || startsWithTodo) && hasLink) {
                        continue
                    }

                    // Regular comment
                    if (!isTodo && !isFixme && !startsWithFixme && !startsWithTodo) {
                        continue
                    }

                    context.report({
                        loc: comment.loc,
                        messageId: 'default',
                    })
                }
            },
        }
    },
    defaultOptions: [],
    meta: {
        docs: {
            description: 'Ensure all TODOs and FIXMEs have an issue link attached to them',
            recommended: false,
            requiresTypeChecking: false,
        },
        messages: {
            default: 'All TODOs and FIXMEs must have an issue link attached to them',
        },
        schema: [{
            additionalProperties: false,
            properties: {
                url: {
                    type: 'string',
                },
            },
            type: 'object',
        }],
        type: 'problem',
    },
    name: NAME,
})

export default {
    name: NAME,
    value,
}
