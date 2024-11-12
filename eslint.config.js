import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    typescript: true,

    // enable UnoCSS support
    // https://unocss.dev/integrations/vscode
    unocss: true,

    formatters: {
      css: true,
    },

  },
  {
    rules: {
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-exports': 'off',
      'perfectionist/sort-named-exports': 'off',
      'style/object-curly-spacing': 'off',
      'style/spaced-comment': 'off',
      'style/semi': 'off',
      'style/quotes': 'off',
      'vue/html-comment-content-spacing': 'off',
      'vue/object-curly-spacing': 'off',
      'vue/block-tag-newline': 'off',
      'style/brace-style': 'off',
      'style/arrow-parens': 'off',
      'style/eol-last': 'off',
      'vue/first-attribute-linebreak': 'off',
    },
  },
  {
    ignores: [
      '.github/**',
      'scripts/**',
    ],
  },
)
