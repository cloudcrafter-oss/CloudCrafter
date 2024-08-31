/** @type {import('eslint').Linter.Config} */
module.exports = {
	root: true,
	ignorePatterns: ['apps/**', 'packages/**'],
	extends: ['@repo/eslint-config/index.js'],
}
