module.exports = {
    extends: [
        require.resolve('@rimac-technology/style-guide/eslint/core'),
        "plugin:eslint-plugin/all"
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.lint.json',
    },
    rules: {
        "eslint-plugin/require-meta-docs-url": "off",
        "eslint-plugin/require-meta-docs-description": "off"
    }
}
