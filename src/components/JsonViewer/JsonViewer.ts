import type { SetupContext } from 'vue'
import type { InjectedJsonViewer, JsonViewerConfig, JsonViewerExposed, JsonViewerTheme } from './JsonViewer.types'
import { computed, defineComponent, h, provide, reactive, ref } from 'vue'
import { DEFAULT_CONFIG, DEFAULT_THEME } from '../../shared/constants'
import { injectJsonViewer } from '../../shared/provide'
import { JsonNode } from '../JsonNode/JsonNode'
import { jsonViewerProps } from './JsonViewerProps'

export const JsonViewer = defineComponent({
  name: 'JsonViewer',
  props: jsonViewerProps,
  setup(props: JsonViewerConfig, { expose }: SetupContext) {
    const rootNode = ref<any>(null)

    const parsedJSON = computed(() => {
      try {
        return JSON.parse(props.json)
      }
      catch {
        return null
      }
    })

    const parseError = computed(() => {
      if (parsedJSON.value === null && props.json.trim()) {
        return 'Invalid JSON format'
      }
      return null
    })

    const mergedTheme = computed<JsonViewerTheme>(() => {
      return {
        ...DEFAULT_THEME,
        ...props.theme,
      }
    })

    const config = reactive<JsonViewerConfig>({
      ...DEFAULT_CONFIG,
      json: props.json,
      defaultExpanded: props.defaultExpanded,
      theme: props.theme,
      showCopyButton: props.showCopyButton,
      showCollapseButton: props.showCollapseButton,
      maxDepth: props.maxDepth,
      copyable: props.copyable,
    })

    const themeStyles = computed(() => {
      const theme = mergedTheme.value
      return {
        '--json-viewer-key': theme.key,
        '--json-viewer-key-dark': theme.keyDark,
        '--json-viewer-string': theme.string,
        '--json-viewer-string-dark': theme.stringDark,
        '--json-viewer-number': theme.number,
        '--json-viewer-number-dark': theme.numberDark,
        '--json-viewer-boolean': theme.boolean,
        '--json-viewer-boolean-dark': theme.booleanDark,
        '--json-viewer-null': theme.null,
        '--json-viewer-null-dark': theme.nullDark,
        '--json-viewer-undefined': theme.undefined,
        '--json-viewer-undefined-dark': theme.undefinedDark,
        '--json-viewer-bracket': theme.bracket,
        '--json-viewer-bracket-dark': theme.bracketDark,
        '--json-viewer-bg': theme.bg,
        '--json-viewer-bg-dark': theme.bgDark,
        '--json-viewer-border': theme.border,
        '--json-viewer-border-dark': theme.borderDark,
        '--json-viewer-button-bg': theme.buttonBg,
        '--json-viewer-button-bg-dark': theme.buttonBgDark,
        '--json-viewer-button-border': theme.buttonBorder,
        '--json-viewer-button-border-dark': theme.buttonBorderDark,
        '--json-viewer-button-text': theme.buttonText,
        '--json-viewer-button-text-dark': theme.buttonTextDark,
      }
    })

    function expandAll() {
      rootNode.value?.expandAll()
    }

    function collapseAll() {
      rootNode.value?.collapseAll()
    }

    async function copyJson() {
      try {
        await navigator.clipboard.writeText(JSON.stringify(parsedJSON.value, null, 2))
        return Promise.resolve(true)
      }
      catch (err) {
        return Promise.reject(err)
      }
    }

    const provided: InjectedJsonViewer = reactive({
      config,
      theme: mergedTheme,
      expandAll,
      collapseAll,
    })

    provide(injectJsonViewer, provided)

    expose<JsonViewerExposed>({
      expandAll,
      collapseAll,
      copyJson,
    })

    return () => {
      const children: any[] = []

      if (parseError.value) {
        children.push(
          h('div', { class: 'json-viewer__error' }, [
            h('span', {}, '⚠️ '),
            h('span', {}, parseError.value),
          ]),
        )
      }
      else {
        children.push(
          h(JsonNode, {
            ref: rootNode,
            value: parsedJSON.value,
            keyName: null,
            depth: 0,
            defaultExpanded: props.defaultExpanded,
          }),
        )
      }

      return h(
        'div',
        {
          class: 'json-viewer',
          style: themeStyles.value,
        },
        children,
      )
    }
  },
})
