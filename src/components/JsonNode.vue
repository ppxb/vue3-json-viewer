<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  value: unknown
  keyName: string | number | null
  depth: number
  defaultExpanded: boolean
  isLastItem?: boolean
}>()

const childNodes = ref<any[]>([])
const isExpanded = ref(props.defaultExpanded)

const valueType = computed(() => {
  if (props.value === null) {
    return 'null'
  }
  if (Array.isArray(props.value)) {
    return 'array'
  }
  return typeof props.value
})

const isComplex = computed(() => valueType.value === 'object' || valueType.value === 'array')

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

const openBracket = computed(() => valueType.value === 'array' ? '[' : '{')
const closeBracket = computed(() => valueType.value === 'array' ? ']' : '}')

function formatNumber(num: number): string {
  const str = String(num)
  const [integer, decimal] = str.split('.')
  const formatted = integer!.replace(/\B(?=(\d{3})+(?!\d))/g, '<span class="pl-0.5"></span>')
  return decimal ? `${formatted}.${decimal}` : formatted
}

function formatValueForPreview(val: unknown, isNested = false) {
  if (val === null) {
    return { text: 'null', class: 'json-null-text' }
  }
  if (val === undefined) {
    return { text: 'undefined', class: 'json-undefined-text' }
  }
  if (typeof val === 'string') {
    return { text: `"${val}"`, class: 'json-string-text' }
  }
  if (typeof val === 'boolean') {
    return { text: String(val), class: 'json-boolean-text' }
  }
  if (typeof val === 'number') {
    return { text: formatNumber(val), class: 'json-number-text', isHtml: true }
  }
  if (Array.isArray(val)) {
    if (isNested && val.length > 0) {
      const items = Array.from({ length: Math.min(val.length, 4) }).fill('{…}')
      const suffix = val.length > 4 ? `, … ${val.length - 4} more` : ''
      return {
        text: `[${items.join(', ')}${suffix}]`,
        class: 'text-#999',
      }
    }
    return { text: '[…]', class: 'text-#999' }
  }
  if (typeof val === 'object') {
    return { text: '{…}', class: 'text-#999' }
  }
  return { text: String(val), class: '' }
}

const arrayCollapsedPreview = computed(() => {
  if (valueType.value !== 'array' || itemCount.value === 0) {
    return []
  }

  const count = itemCount.value
  const displayCount = Math.min(count, 4)
  const items = Array.from({ length: displayCount }).fill(null).map(() => ({ text: '{…}', class: 'text-#999' }))

  if (count > 4) {
    items.push({
      text: `… ${count - 4} more`,
      class: 'text-#999',
      isMore: true,
    } as any)
  }
  return items
})

const objectCollapsedPreview = computed(() => {
  if (valueType.value !== 'object') {
    return []
  }

  const obj = props.value as Record<string, unknown>
  const keys = Object.keys(obj)

  if (keys.length === 0) {
    return []
  }

  const items = keys.slice(0, 4).map(key => ({
    key,
    value: formatValueForPreview(obj[key], true),
    isMore: null,
  }))

  if (keys.length > 4) {
    items.push({
      key: '',
      value: { text: `… ${keys.length - 4} more`, class: 'text-#999' },
      isMore: true,
    } as any)
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

const valueClass = computed(() => `json-${valueType.value}-text`)

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
  return isComplex.value && isExpanded.value && itemCount.value > 0
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
    // with your own message util
  }
  catch (error) {
    // with your own message util
    console.error('Failed to copy to clipboard:', error)
  }
}

defineExpose({ expandAll, collapseAll })
</script>

<template>
  <div class="json-node my-0.5 relative" :class="{ 'has-collapse-btn': showCollapseButton }">
    <template v-if="isComplex">
      <div class="node-header font-mono rounded" flex="~ items-center gap1">
        <div
          v-if="keyName !== null && typeof keyName !== 'number'"
          flex="~"
          class="json-key-text"
        >
          <span>{{ keyName }}</span>
          <span class="json-bracket-text select-none">: </span>
        </div>

        <span
          class="json-bracket-text"
          @click="toggleExpand"
        >
          {{ openBracket }}
        </span>

        <template v-if="isExpanded && itemCount > 0">
          <button class="json-btn-collapse json-btn-style" @click="toggleExpand" />
          <button class="json-btn-copy json-btn-style" @click="copyToClipboard" />
          <span class="text-[11px] text-#999 ml2">{{ countLabel }}</span>
        </template>

        <template v-if="!isExpanded">
          <template v-if="valueType === 'array'">
            <span class="cursor-pointer select-none" @click="toggleExpand">
              <template
                v-for="(item, index) in arrayCollapsedPreview"
                :key="index"
              >
                <span :class="item.class">{{ item.text }}</span>
                <span
                  v-if="index < arrayCollapsedPreview.length - 1"
                  class="json-bracket-text"
                >
                  ,
                </span>
              </template>
            </span>
          </template>

          <template v-else-if="valueType === 'object'">
            <span class="cursor-pointer select-none" @click="toggleExpand">
              <template v-if="objectCollapsedPreview.length === 0">
                <span class="text-#999">empty</span>
              </template>
              <template v-else>
                <template
                  v-for="(item, index) in objectCollapsedPreview"
                  :key="index"
                >
                  <template v-if="!item.isMore">
                    <span class="json-key-text">{{ item.key }}</span>
                    <span class="json-bracket-text">: </span>
                    <span v-if="item.value.isHtml" :class="item.value.class" v-html="item.value.text" />
                    <span v-else :class="item.value.class">{{ item.value.text }}</span>
                  </template>
                  <template v-else>
                    <span :class="item.value.class">{{ item.value.text }}</span>
                  </template>
                  <span
                    v-if="index < objectCollapsedPreview.length - 1"
                    class="json-bracket-text"
                  >
                    ,
                  </span>
                </template>
              </template>
            </span>
          </template>

          <span class="text-#24292e dark:text-#d4d4d4" @click="toggleExpand">{{ closeBracket }}</span>
          <span v-if="!isLastItem && depth > 0" class="text-#24292e dark:text-#d4d4d4">,</span>
        </template>
      </div>

      <div v-if="isExpanded" class="font-mono relative">
        <div class="bg-[linear-gradient(to_bottom,rgba(187,187,187,0.15),rgba(187,187,187,0.15))] w-px bottom-6 left-1 top-0 absolute" />
        <JsonNode
          v-for="(key, index) in entryKeys"
          ref="childNodes"
          :key="key"
          :value="valueType === 'array' ? (value as unknown[])[key as number] : (value as Record<string, unknown>)[key]"
          :key-name="key"
          :depth="depth + 1"
          :default-expanded="defaultExpanded"
          :is-last-item="index === entryKeys.length - 1"
          class="pl8"
        />
        <div flex="~ items-center">
          <span class="json-bracket-text">{{ closeBracket }}</span>
          <span
            v-if="!isLastItem && depth > 0"
            class="json-bracket-text"
          >
            ,
          </span>
        </div>
      </div>
    </template>

    <template v-else>
      <div flex="~ items-center">
        <span v-if="keyName !== null" class="json-key-text">
          <span>{{ keyName }}</span>
          <span>:&nbsp;</span>
        </span>
        <span :class="valueClass" v-html="formattedValue" />
        <span
          v-if="!isLastItem"
          class="json-bracket-text"
        >
          ,
        </span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.json-node:not(.has-collapse-btn) .node-header:hover {
  background-color: rgba(187, 187, 187, 0.25);
}

.json-btn-collapse::before {
  content: '\2013';
}

.json-btn-copy::before {
  content: '\0192';
}
</style>
