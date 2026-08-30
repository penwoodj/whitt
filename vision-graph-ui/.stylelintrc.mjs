const whites = ['white', '#fff', '#ffffff', '#FFF', '#FFFFFF', 'rgb(255,255,255)', 'rgb(255, 255, 255)']

export default {
  customSyntax: 'postcss-styled-syntax',
  rules: {
    'declaration-property-value-disallowed-list': {
      'background': whites,
      'background-color': whites,
    },
    'no-empty-source': null,
    'nesting-selector-no-missing-scoping-root': null,
  },
  overrides: [
    {
      files: ['**/*.tsx'],
      customSyntax: 'postcss-styled-syntax',
    },
  ],
}
