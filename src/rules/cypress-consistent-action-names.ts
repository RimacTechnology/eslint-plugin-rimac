import { createRule } from '../utils'

export type CypressConsistentActionNamesOptionsType = {
    allowedPrefixes: string[]
    fileExtension: string
}

const NAME = 'cypress-consistent-action-names'

const value = createRule<CypressConsistentActionNamesOptionsType[], string>({
    create(context) {
        return {
            MethodDefinition(node) {
                const allowedPrefixes = context.options[0]?.allowedPrefixes
                const allowedFileExtension = context.options[0]?.fileExtension

                if (!allowedPrefixes || !allowedFileExtension) {
                    throw new Error('Missing config options.')
                }

                // Only check methods with a name
                if (!('name' in node.key)) {
                    return
                }

                // `isInTest` is used to skip the filetype check in the test we so we can keep test file names consistent
                if (!context.settings.isInTest && !context.getFilename().endsWith(allowedFileExtension)) {
                    return
                }

                // We only want to check public methods that are used in the actual test
                if (node.accessibility !== 'public') {
                    return
                }

                // Typescript has weird inference where this works, but if we use `node.key.name.startsWith`
                // directly in `.some` below it's no longer narrowed down and it's undefined
                const name = node.key.name

                const hasValidPrefix = allowedPrefixes.some((prefix) => {
                    return name.startsWith(prefix)
                })

                if (!hasValidPrefix) {
                    context.report({
                        data: {
                            allowedPrefixes,
                        },
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
            description: 'Consistent cypress action names',
            recommended: false,
            requiresTypeChecking: false,
        },
        messages: {
            default: 'Cypress action names must start with one of the following: \'{{ allowedPrefixes }}\'',
        },
        schema: [
            {
                additionalProperties: false,
                properties: {
                    allowedPrefixes: {
                        description: 'List of accepted prefixes for cypress actions',
                        type: 'array',
                    },
                    fileExtension: {
                        description: 'Files in which actions will be checked. Example: \'.cy.ts\'',
                        type: 'string',
                    },
                },
                type: 'object',
            },
        ],
        type: 'problem',
    },
    name: NAME,
})

export default {
    name: NAME,
    value,
}
