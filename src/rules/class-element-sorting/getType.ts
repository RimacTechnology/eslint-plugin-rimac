import type { ClassElement } from '@typescript-eslint/types/dist/generated/ast-spec'
import { AST_NODE_TYPES } from '@typescript-eslint/utils'

import { ELEMENTS } from './elements'

export const getType = (element: ClassElement) => {
    const isMethod = element.type === AST_NODE_TYPES.MethodDefinition
    const isProperty = element.type === AST_NODE_TYPES.PropertyDefinition

    // Public static methods
    if (isMethod && element.static && element.accessibility === 'public') {
        return ELEMENTS.PUBLIC_STATIC_METHODS
    }

    // Private static methods
    if (isMethod && element.static && element.accessibility === 'private') {
        return ELEMENTS.PRIVATE_STATIC_METHODS
    }

    // Private static properties
    if (isProperty && element.static && element.accessibility === 'private') {
        return ELEMENTS.PRIVATE_STATIC_PROPERTIES
    }

    // Public static properties
    if (isProperty && element.static && element.accessibility === 'public') {
        return ELEMENTS.PUBLIC_STATIC_PROPERTIES
    }

    // Private properties
    if (
        isProperty && (
            element.accessibility === 'private' ||
            element.key.type === AST_NODE_TYPES.PrivateIdentifier
        )
    ) {
        return ELEMENTS.PRIVATE_PROPERTIES
    }

    // Private methods
    if (
        isMethod &&
        element.kind !== 'get' &&
        element.kind !== 'set' && (
            element.accessibility === 'private' ||
            element.key.type === AST_NODE_TYPES.PrivateIdentifier
        )
    ) {
        return ELEMENTS.PRIVATE_METHODS
    }

    // Public methods
    if (
        isMethod &&
        element.accessibility === 'public' &&
        element.kind !== 'get' &&
        element.kind !== 'set'
    ) {
        return ELEMENTS.PUBLIC_METHODS
    }

    // Public properties
    if (isProperty && element.accessibility === 'public') {
        return ELEMENTS.PUBLIC_PROPERTIES
    }

    // Constructors
    if (isMethod && element.kind === 'constructor') {
        return ELEMENTS.CONSTRUCTORS
    }

    // Setters
    if (isMethod && element.kind === 'set') {
        return ELEMENTS.SETTERS
    }

    // Getters
    if (isMethod && element.kind === 'get') {
        return ELEMENTS.GETTERS
    }

    // Static properties
    if (isProperty && element.static) {
        return ELEMENTS.STATIC_PROPERTIES
    }

    // Static methods
    if (isMethod && element.static) {
        return ELEMENTS.STATIC_METHODS
    }

    return ELEMENTS.OTHER
}
