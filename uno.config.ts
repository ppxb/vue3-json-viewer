import {
  defineConfig,
  presetAttributify,
  presetWebFonts,
  presetWind4,
  transformerDirectives,
} from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
    presetWebFonts({
      provider: 'bunny',
      fonts: {
        mono: ['DM Mono:400,700'],
      },
    }),
    presetAttributify(),
  ],
  transformers: [
    transformerDirectives(),
  ],
})
