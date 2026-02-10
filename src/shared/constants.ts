import type { JsonViewerConfig, JsonViewerTheme } from '@/components/JsonViewer/JsonViewer.types'

export const DEFAULT_THEME: JsonViewerTheme = {
  key: '#bd6476',
  keyDark: '#9cdcfe',
  string: '#690',
  stringDark: '#ce9178',
  number: '#07a',
  numberDark: '#b5cea8',
  boolean: '#07a',
  booleanDark: '#b5cea8',
  null: '#6f42c1',
  nullDark: '#bd6476',
  undefined: '#999',
  undefinedDark: '#999',
  bracket: '#24292e',
  bracketDark: '#d4d4d4',
  bg: '#ffffff',
  bgDark: '#1c1e23',
  border: '#e1e4e8',
  borderDark: '#36363a',
  buttonBg: 'transparent',
  buttonBgDark: 'transparent',
  buttonBorder: '#e1e4e8',
  buttonBorderDark: '#36363a',
  buttonText: '#6a737d',
  buttonTextDark: '#858585',
}

export const DEFAULT_CONFIG: Partial<JsonViewerConfig> = {
  defaultExpanded: true,
  showCopyButton: true,
  showCollapseButton: true,
  maxDepth: Infinity,
  copyable: true,
}
