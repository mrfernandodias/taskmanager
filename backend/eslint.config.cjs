const js = require('@eslint/js');
const importPlugin = require('eslint-plugin-import');
const globals = require('globals');

module.exports = [
  // Regras recomendadas do core do ESLint
  js.configs.recommended,

  // Ignorar pastas de build e dependências
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
  },

  // Regras do projeto (Node/CommonJS)
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script', // CommonJS
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': { node: { extensions: ['.js', '.json'] } },
    },
    rules: {
      // Regras recomendadas do plugin import
      ...importPlugin.configs.recommended.rules,

      // Ordenação de imports/requires
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // Boas práticas gerais
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
    },
  },
];
