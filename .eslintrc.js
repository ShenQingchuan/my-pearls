const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  root: true,
  ignorePatterns: ['node_modules', 'dist', 'docs', 'typedoc.json'],
  extends: ['@sxzz/eslint-config-ts', '@sxzz/eslint-config-prettier'],
})
