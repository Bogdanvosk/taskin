const { eslint } = require('@siberiacancode/eslint')

module.exports = {
  ...eslint.node,
  extends: ['prettier'],
  overrides: [
    ...eslint.node.overrides,
    {
      files: ['*.tsx', '*.ts'],
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/await-thenable': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-enum-comparison': 'off',
        // '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/naming-convention': 'off',
        'no-underscore-dangle': 'off',
        'no-restricted-syntax': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off'
      }
    }
  ]
}
