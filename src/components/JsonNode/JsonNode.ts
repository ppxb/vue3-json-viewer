import type { VNode } from 'vue'
import type { JsonNodeExposed } from '../JsonViewer/JsonViewer.types'
import { computed, defineComponent, h, inject, ref } from 'vue'
import { injectJsonViewer } from '../../shared/provide'
import { formatNumber, formatValueForPreview, getValueType, isComplexType } from '../../utils/format'
import { jsonNodeProps } from './JsonNodeProps'

interface ArrayPreviewItem {
  text: string
  class: string
  isMore?: boolean
}

interface ObjectPreviewItem {
  key: string
  value: { text: string, class: string, isHtml?: boolean }
  isMore?: boolean
}

export const JsonNode = defineComponent({
  name: 'JsonNode',
  props: jsonNodeProps,
  setup(props, { expose }) {
    const childNodes = ref<JsonNodeExposed[]>([])
    const isExpanded = ref(props.defaultExpanded)
    const jsonViewer = inject(injectJsonViewer, null)

    const valueType = computed(() => getValueType(props.value))
    const isComplex = computed(() => isComplexType(valueType.value))

    const itemCount = computed(() => {
      if (valueType.value === 'array') {
        return (props.value as unknown[]).length
      }
      if (valueType.value === 'object') {
        return Object.keys(props.value as object).length
      }
      return 0
    })

    const countLabel = computed(() => {
      if (!isExpanded.value || itemCount.value === 0) {
        return ''
      }
      const count = itemCount.value
      return valueType.value === 'array'
        ? `${count} element${count !== 1 ? 's' : ''}`
        : `${count} entr${count !== 1 ? 'ies' : 'y'}`
    })

    const openBracket = computed(() => (valueType.value === 'array' ? '[' : '{'))
    const closeBracket = computed(() => (valueType.value === 'array' ? ']' : '}'))

    const arrayCollapsedPreview = computed<ArrayPreviewItem[]>(() => {
      if (valueType.value !== 'array' || itemCount.value === 0) {
        return []
      }

      const count = itemCount.value
      const displayCount = Math.min(count, 4)
      const items: ArrayPreviewItem[] = Array.from({ length: displayCount }).fill(null).map(() => ({
        text: '{…}',
        class: 'json-viewer__preview',
      }))

      if (count > 4) {
        items.push({
          text: `… ${count - 4} more`,
          class: 'json-viewer__preview',
          isMore: true,
        })
      }
      return items
    })

    const objectCollapsedPreview = computed<ObjectPreviewItem[]>(() => {
      if (valueType.value !== 'object') {
        return []
      }

      const obj = props.value as Record<string, unknown>
      const keys = Object.keys(obj)

      if (keys.length === 0) {
        return []
      }

      const items: ObjectPreviewItem[] = keys.slice(0, 4).map(key => ({
        key,
        value: formatValueForPreview(obj[key], true),
        isMore: false,
      }))

      if (keys.length > 4) {
        items.push({
          key: '',
          value: { text: `… ${keys.length - 4} more`, class: 'json-viewer__preview' },
          isMore: true,
        })
      }
      return items
    })

    const formattedValue = computed(() => {
      const val = props.value
      if (val === null) {
        return 'null'
      }
      if (val === undefined) {
        return 'undefined'
      }
      if (typeof val === 'string') {
        return `"${val}"`
      }
      if (typeof val === 'boolean') {
        return String(val)
      }
      if (typeof val === 'number') {
        return formatNumber(val)
      }
      return String(val)
    })

    const valueClass = computed(() => `json-viewer__${valueType.value}`)

    const entryKeys = computed(() => {
      if (valueType.value === 'array') {
        return Array.from({ length: itemCount.value }, (_, i) => i)
      }
      if (valueType.value === 'object') {
        return Object.keys(props.value as object)
      }
      return []
    })

    const showCollapseButton = computed(() => {
      return isComplex.value && isExpanded.value && itemCount.value > 0 && jsonViewer?.config.showCollapseButton
    })

    const showCopyButton = computed(() => {
      return isComplex.value && isExpanded.value && itemCount.value > 0 && jsonViewer?.config.copyable
    })

    function toggleExpand() {
      isExpanded.value = !isExpanded.value
    }

    function expandAll() {
      if (isComplex.value) {
        isExpanded.value = true
        childNodes.value.forEach(child => child.expandAll?.())
      }
    }

    function collapseAll() {
      if (isComplex.value) {
        if (props.depth > 0)
          isExpanded.value = false
        childNodes.value.forEach(child => child.collapseAll?.())
      }
    }

    async function copyToClipboard() {
      try {
        const jsonString = JSON.stringify(props.value, null, 2)
        await navigator.clipboard.writeText(jsonString)
        return true
      }
      catch (error) {
        console.error('Failed to copy to clipboard:', error)
        return false
      }
    }

    expose({
      expandAll,
      collapseAll,
    } satisfies JsonNodeExposed)

    return () => {
      const children: VNode[] = []

      if (isComplex.value) {
        // Header
        const headerChildren: VNode[] = []

        // Key name (if exists)
        if (props.keyName !== null && typeof props.keyName !== 'number') {
          headerChildren.push(
            h('div', { class: 'json-viewer__key-wrapper' }, [
              h('span', { class: 'json-viewer__key' }, String(props.keyName)),
              h('span', { class: 'json-viewer__bracket json-viewer__colon' }, ': '),
            ]),
          )
        }

        // Open bracket
        headerChildren.push(
          h('span', {
            class: 'json-viewer__bracket',
            onClick: toggleExpand,
          }, openBracket.value),
        )

        // Expanded state controls
        if (isExpanded.value && itemCount.value > 0) {
          if (showCollapseButton.value) {
            headerChildren.push(
              h('button', {
                class: 'json-viewer__button json-viewer__button--collapse',
                onClick: toggleExpand,
                title: 'Collapse',
              }),
            )
          }

          if (showCopyButton.value) {
            headerChildren.push(
              h('button', {
                class: 'json-viewer__button json-viewer__button--copy',
                onClick: copyToClipboard,
                title: 'Copy',
              }),
            )
          }

          headerChildren.push(
            h('span', { class: 'json-viewer__count' }, countLabel.value),
          )
        }

        // Collapsed preview
        if (!isExpanded.value) {
          if (valueType.value === 'array') {
            const previewChildren: VNode[] = []
            arrayCollapsedPreview.value.forEach((item, index) => {
              previewChildren.push(
                h('span', { class: item.class }, item.text),
              )
              if (index < arrayCollapsedPreview.value.length - 1) {
                previewChildren.push(
                  h('span', { class: 'json-viewer__bracket' }, ', '),
                )
              }
            })
            headerChildren.push(
              h('span', {
                class: 'json-viewer__preview-wrapper',
                onClick: toggleExpand,
              }, previewChildren),
            )
          }
          else if (valueType.value === 'object') {
            const previewChildren: VNode[] = []

            if (objectCollapsedPreview.value.length === 0) {
              previewChildren.push(
                h('span', { class: 'json-viewer__preview' }, 'empty'),
              )
            }
            else {
              objectCollapsedPreview.value.forEach((item, index) => {
                if (!item.isMore) {
                  previewChildren.push(
                    h('span', { class: 'json-viewer__key' }, item.key),
                  )
                  previewChildren.push(
                    h('span', { class: 'json-viewer__bracket' }, ': '),
                  )
                  if (item.value.isHtml) {
                    previewChildren.push(
                      h('span', {
                        class: item.value.class,
                        innerHTML: item.value.text,
                      }),
                    )
                  }
                  else {
                    previewChildren.push(
                      h('span', { class: item.value.class }, item.value.text),
                    )
                  }
                }
                else {
                  previewChildren.push(
                    h('span', { class: item.value.class }, item.value.text),
                  )
                }

                if (index < objectCollapsedPreview.value.length - 1) {
                  previewChildren.push(
                    h('span', { class: 'json-viewer__bracket' }, ', '),
                  )
                }
              })
            }

            headerChildren.push(
              h('span', {
                class: 'json-viewer__preview-wrapper',
                onClick: toggleExpand,
              }, previewChildren),
            )
          }

          headerChildren.push(
            h('span', {
              class: 'json-viewer__bracket',
              onClick: toggleExpand,
            }, closeBracket.value),
          )

          if (!props.isLastItem && props.depth > 0) {
            headerChildren.push(
              h('span', { class: 'json-viewer__bracket' }, ','),
            )
          }
        }

        children.push(
          h('div', {
            class: [
              'json-viewer__node-header',
              { 'json-viewer__node-header--has-controls': showCollapseButton.value },
            ],
          }, headerChildren),
        )

        // Expanded children
        if (isExpanded.value) {
          const expandedChildren: VNode[] = []

          expandedChildren.push(
            h('div', { class: 'json-viewer__indent-guide' }),
          )

          entryKeys.value.forEach((key, index) => {
            expandedChildren.push(
              h(JsonNode, {
                ref: (el: any) => {
                  if (el)
                    childNodes.value[index] = el
                },
                key,
                value: (valueType.value === 'array'
                  ? (props.value as unknown[])[key as number]
                  : (props.value as Record<string, unknown>)[key]) as any,
                keyName: key,
                depth: props.depth + 1,
                defaultExpanded: props.defaultExpanded,
                isLastItem: index === entryKeys.value.length - 1,
                class: 'json-viewer__child',
              }),
            )
          })

          const closingChildren: VNode[] = [
            h('span', { class: 'json-viewer__bracket' }, closeBracket.value),
          ]

          if (!props.isLastItem && props.depth > 0) {
            closingChildren.push(
              h('span', { class: 'json-viewer__bracket' }, ','),
            )
          }

          expandedChildren.push(
            h('div', { class: 'json-viewer__closing' }, closingChildren),
          )

          children.push(
            h('div', { class: 'json-viewer__expanded' }, expandedChildren),
          )
        }
      }
      else {
        // Simple value
        const simpleChildren: VNode[] = []

        if (props.keyName !== null) {
          simpleChildren.push(
            h('span', { class: 'json-viewer__key' }, [
              h('span', {}, String(props.keyName)),
              h('span', {}, ': '),
            ]),
          )
        }

        simpleChildren.push(
          h('span', {
            class: valueClass.value,
            innerHTML: formattedValue.value,
          }),
        )

        if (!props.isLastItem) {
          simpleChildren.push(
            h('span', { class: 'json-viewer__bracket' }, ','),
          )
        }

        children.push(
          h('div', { class: 'json-viewer__simple' }, simpleChildren),
        )
      }

      return h('div', { class: 'json-viewer__node' }, children)
    }
  },
})
