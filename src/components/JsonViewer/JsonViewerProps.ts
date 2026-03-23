import type { PropType } from 'vue'
import type { JsonViewerColorMode, JsonViewerTheme } from './JsonViewer.types'

export const jsonViewerProps = {
  json: {
    type: String,
    default: '',
  },
  defaultExpanded: {
    type: Boolean,
    default: true,
  },
  theme: {
    type: Object as PropType<JsonViewerTheme>,
    default: undefined,
  },
  colorMode: {
    type: String as PropType<JsonViewerColorMode>,
    default: 'system',
  },
  showCopyButton: {
    type: Boolean,
    default: true,
  },
  showCollapseButton: {
    type: Boolean,
    default: true,
  },
  maxDepth: {
    type: Number,
    default: Infinity,
  },
  copyable: {
    type: Boolean,
    default: true,
  },
} as const
