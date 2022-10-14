import classElementSorting from './rules/class-element-sorting'
import cypressConsistentActionNames from './rules/cypress-consistent-action-names'
import documentTodos from './rules/document-todos'
import importDeclarationNewline from './rules/import-declaration-newline'

const configuration = {
    rules: {
        [importDeclarationNewline.name]: importDeclarationNewline.value,
        [documentTodos.name]: documentTodos.value,
        [classElementSorting.name]: classElementSorting.value,
        [cypressConsistentActionNames.name]: cypressConsistentActionNames.value,
    },
}

export = configuration
