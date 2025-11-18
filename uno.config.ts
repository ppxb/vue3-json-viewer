import {
  defineConfig,
  presetAttributify,
  presetWebFonts,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      'json-bg': '#ffffff',
      'json-bg-dark': '#1c1e23',
      'json-border': '#e1e4e8',
      'json-border-dark': '#36363a',
      'json-key': '#bd6476',
      'json-key-dark': '#9cdcfe',
      'json-string': '#690',
      'json-string-dark': '#ce9178',
      'json-number': '#07a',
      'json-number-dark': '#b5cea8',
      'json-boolean': '#07a',
      'json-boolean-dark': '#b5cea8',
      'json-null': '#6f42c1',
      'json-null-dark': '#bd6476',
      'json-bracket': '#24292e',
      'json-bracket-dark': '#d4d4d4',
      'json-btn': '#6a737d',
      'json-btn-dark': '#858585',
      'json-btn-border': '#e1e4e8',
      'json-btn-border-dark': '#36363a',
    },
  },
  shortcuts: {
    'json-key-text': 'text-json-key dark:text-json-key-dark',
    'json-string-text': 'text-json-string dark:text-json-string-dark',
    'json-number-text': 'text-json-number dark:text-json-number-dark',
    'json-boolean-text': 'text-json-boolean dark:text-json-boolean-dark',
    'json-null-text': 'text-json-null dark:text-json-null-dark',
    'json-bracket-text': 'text-json-bracket dark:text-json-bracket-dark select-none',
    'json-btn-style': 'text-2.5 w-4.5 h-4.5 flex items-center justify-center rounded-md cursor-pointer text-json-btn dark:text-json-btn-dark border border-json-btn-border dark:border-json-btn-border-dark hover:bg-black/5 dark:hover:bg-white/10',
  },
  presets: [
    presetWind4({
      dark: 'class',
      preflights: {
        reset: true,
      },
    }),
    presetWebFonts({
      provider: 'bunny',
      fonts: {
        mono: ['DM Mono:400,500,700'],
      },
    }),
    presetAttributify(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
