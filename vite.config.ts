import { defineConfig } from 'vite-plus';

export default defineConfig({
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    sortImports: {
      groups: [
        'type-import',
        'type-internal',
        ['type-parent', 'type-sibling', 'type-index'],
        ['value-builtin', 'value-external'],
        'value-internal',
        ['value-parent', 'value-sibling', 'value-index'],
        'unknown',
      ],
      newlinesBetween: false,
    },
    sortPackageJson: false,
    singleQuote: true,
  },
});
