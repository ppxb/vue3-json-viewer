import type { Ref } from 'vue'

export interface JsonViewerTheme {
  key?: string
  keyDark?: string
  string?: string
  stringDark?: string
  number?: string
  numberDark?: string
  boolean?: string
  booleanDark?: string
  null?: string
  nullDark?: string
  undefined?: string
  undefinedDark?: string
  bracket?: string
  bracketDark?: string
  bg?: string
  bgDark?: string
  border?: string
  borderDark?: string
  buttonBg?: string
  buttonBgDark?: string
  buttonBorder?: string
  buttonBorderDark?: string
  buttonText?: string
  buttonTextDark?: string
}

export interface JsonViewerConfig {
  json: string
  defaultExpanded: boolean
  theme?: JsonViewerTheme
  showCopyButton: boolean
  showCollapseButton: boolean
  maxDepth: number
  copyable: boolean
}

export interface JsonViewerExposed {
  expandAll: () => void
  collapseAll: () => void
  copyJson: () => Promise<boolean>
}

export interface InjectedJsonViewer {
  config: JsonViewerConfig
  theme: Ref<JsonViewerTheme>
  expandAll: () => void
  collapseAll: () => void
}

export interface JsonNodeExposed {
  expandAll: () => void
  collapseAll: () => void
}
