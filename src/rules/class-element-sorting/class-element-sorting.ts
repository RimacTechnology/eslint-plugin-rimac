/* eslint-disable sort-keys-fix/sort-keys-fix */

import type { ClassElement } from '@typescript-eslint/types/dist/generated/ast-spec'

import { createRule } from '../../utils'

import type { ELEMENTS } from './elements'
import { getType } from './getType'
import { sortMembers } from './sortMembers'

const NAME = 'class-element-sorting'

const value = createRule({
    create(context) {
        return {
            ClassBody(node) {
                const sourceCode = context.getSourceCode()

                const unsortedElementsList = [...node.body]

                const sortedElementsDictionary: Record<ELEMENTS, ClassElement[]> = {
                    'static-methods': [],
                    'public-static-methods': [],
                    'private-static-methods': [],
                    'static-properties': [],
                    'public-static-properties': [],
                    'private-static-properties': [],
                    'protected-static-methods': [],
                    'protected-static-properties': [],
                    'protected-properties': [],
                    'public-properties': [],
                    'private-properties': [],
                    constructors: [],
                    getters: [],
                    setters: [],
                    'protected-methods': [],
                    'public-methods': [],
                    'private-methods': [],
                    other: [],
                }

                // Sort class elements into the correct order
                node.body.forEach((element) => { // @ts-expect-error
                    const type = getType(element)

                    // @ts-expect-error
                    sortedElementsDictionary[type].push(element)
                })

                // Sort every group in the list
                for (const element of Object.keys(sortedElementsDictionary)) {
                    sortedElementsDictionary[element as ELEMENTS].sort(sortMembers)
                }

                // Take the correctly sorted elements from the dictionary and put them into a flat list
                const sortedElementList = Object
                    .values(sortedElementsDictionary)
                    .reduce((accumulator, sortedElements) => {
                        return [...accumulator, ...sortedElements]
                    }, [])

                /*
                 * Here we are checking if the initial sequence of class elements is correct
                 * and if any fixing needs to occur.
                 *
                 * Given we:
                 *     - Have 2 lists of same elements(not the same sequence):
                 *          - Sorted list (correct sequence)
                 *          - Unsorted list (initial sequence)
                 *     - Can uniquely identify an element by it's start and end position
                 *          - For example we can only have one function on line 4, column 2
                 *
                 * We can compare an element from the unsorted list to the element from the sorted list
                 * at the same index (for example both are at the 2nd place in the list) and if both elements
                 * have the same position, the element from the unsorted list is in the correct place.
                 *
                 * If when comparing elements, positions don't match, it means that the element from unsorted
                 * list was moved to another location in the sorted list and the class elements sequence is incorrect
                 * and needs fixing.
                 *
                 */
                const isCorrect = sortedElementList.every((element, index) => {
                    const sortedElementLoc = element.loc
                    const unsortedElementLoc = unsortedElementsList[index]?.loc

                    if (!unsortedElementLoc) {
                        return false
                    }

                    return (
                        sortedElementLoc.end === unsortedElementLoc.end &&
                        sortedElementLoc.start === unsortedElementLoc.start
                    )
                })

                if (isCorrect) {
                    return
                }

                // Go trough each element and append it to a single string that becomes the class content
                const fixedClassContent = sortedElementList.reduce((fixedClassContentAccumulator, element) => { // @ts-expect-error
                    const text = sourceCode.getText(element) // @ts-expect-error
                    const comments = sourceCode.getCommentsBefore(element)

                    // Comments are given in the reverse order of
                    // their original location so we need to reverse it back
                    comments.reverse()

                    /*
                     * Append the comments to the method/property text.
                     *
                     * When they are retrieved from AST, we don't get the comment
                     * prefixes with them like `//` for regular comments and `/*`
                     * for block comments.
                     *
                     * The solution is to append those back when appending the comment
                     * to the code.
                     */
                    const elementWithComments = comments.reduce((commentAccumulator, comment) => {
                        // For block comment
                        if (comment.value.startsWith('*')) {
                            return `/*${comment.value}*/\n${commentAccumulator}`
                        }

                        // For regular comments
                        return `//${comment.value}\n${commentAccumulator}`
                    }, `${text}\n`)

                    return fixedClassContentAccumulator + elementWithComments
                }, '')

                context.report({
                    fix: (fixer) => {
                        return fixer.replaceTextRange(node.range, `{\n${fixedClassContent}}`)
                    },
                    messageId: 'default',
                    loc: node.loc,
                })
            },
        }
    },
    defaultOptions: [],
    meta: {
        fixable: 'code',
        docs: {
            description: 'Ensure class elements are sorted.',
            recommended: false,
            requiresTypeChecking: true,
        },
        messages: {
            default: 'Class elements must be sorted.',
        },
        schema: [],
        type: 'layout',
    },
    name: NAME,
})

export default {
    name: NAME,
    value,
}
