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

// 值类型判断
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

// 元素数量
const itemCount = computed(() => {
  if (valueType.value === 'array') {
    return (props.value as unknown[]).length
  }
  if (valueType.value === 'object') {
    return Object.keys(props.value as object).length
  }
  return 0
})

// 数量标签文本
const countLabel = computed(() => {
  if (!isExpanded.value || itemCount.value === 0) {
    return ''
  }
  const count = itemCount.value
  return valueType.value === 'array'
    ? `${count} element${count !== 1 ? 's' : ''}`
    : `${count} entr${count !== 1 ? 'ies' : 'y'}`
})

// 括号
const openBracket = computed(() => valueType.value === 'array' ? '[' : '{')
const closeBracket = computed(() => valueType.value === 'array' ? ']' : '}')

// 格式化数字 - 每三位添加分隔符
function formatNumber(num: number): string {
  const str = String(num)
  const [integer, decimal] = str.split('.')
  const formatted = integer!.replace(/\B(?=(\d{3})+(?!\d))/g, '<span class="num-delim"></span>')
  return decimal ? `${formatted}.${decimal}` : formatted
}

// 格式化单个值用于预览
function formatValueForPreview(val: unknown, isNested = false) {
  if (val === null) {
    return { text: 'null', class: 'value-null' }
  }
  if (val === undefined) {
    return { text: 'undefined', class: 'value-undefined' }
  }
  if (typeof val === 'string') {
    return { text: `"${val}"`, class: 'value-string' }
  }
  if (typeof val === 'boolean') {
    return { text: String(val), class: 'value-boolean' }
  }
  if (typeof val === 'number') {
    return { text: formatNumber(val), class: 'value-number', isHtml: true }
  }
  if (Array.isArray(val)) {
    if (isNested && val.length > 0) {
      const displayCount = Math.min(val.length, 4)
      const items = Array.from({ length: displayCount }).fill('{…}')
      const suffix = val.length > 4 ? `, … ${val.length - 4} more` : ''
      return {
        text: `[${items.join(', ')}${suffix}]`,
        class: 'value-array',
      }
    }
    return { text: '[…]', class: 'value-array' }
  }
  if (typeof val === 'object') {
    return { text: '{…}', class: 'value-object' }
  }
  return { text: String(val), class: '' }
}

// 折叠时的数组预览
const arrayCollapsedPreview = computed(() => {
  if (valueType.value !== 'array' || itemCount.value === 0) {
    return []
  }

  const count = itemCount.value
  const displayCount = Math.min(count, 4)
  const items = Array.from({ length: displayCount }).fill(null).map(() => ({ text: '{…}', class: 'value-object' }))

  if (count > 4) {
    items.push({
      text: `… ${count - 4} more`,
      class: 'preview-more',
      isMore: true,
    } as any)
  }
  return items
})

// 折叠时的对象预览
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
      value: { text: `… ${keys.length - 4} more`, class: 'preview-more' },
      isMore: true,
    } as any)
  }
  return items
})

// 格式化的值（基础类型）
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

// 值的样式类
const valueClass = computed(() => `value-${valueType.value}`)
const keyClass = computed(() => typeof props.keyName === 'number' ? 'key-index' : 'key-name')

// 获取键列表
const entryKeys = computed(() => {
  if (valueType.value === 'array') {
    return Array.from({ length: itemCount.value }, (_, i) => i)
  }
  if (valueType.value === 'object') {
    return Object.keys(props.value as object)
  }
  return []
})

// 判断是否显示折叠按钮
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

defineExpose({ expandAll, collapseAll })
</script>

<template>
  <div class="json-node" :class="{ 'has-collapse-btn': showCollapseButton }">
    <!-- 对象或数组 -->
    <template v-if="isComplex">
      <div class="node-header font-mono">
        <!-- 键名 -->
        <div v-if="keyName !== null && typeof keyName !== 'number'" class="key-wrapper" :class="keyClass">
          <span>{{ keyName }}</span>
          <span class="preview-colon">: </span>
        </div>

        <!-- 括号 -->
        <span class="bracket" @click="toggleExpand">{{ openBracket }}</span>

        <template v-if="isExpanded && itemCount > 0">
          <button class="collapse-btn" @click="toggleExpand">
            −
          </button>
          <button class="collapse-btn">
            ƒ
          </button>
          <span class="count-label">{{ countLabel }}</span>
        </template>

        <!-- 折叠时的预览 -->
        <template v-if="!isExpanded">
          <!-- 数组预览 -->
          <template v-if="valueType === 'array'">
            <span class="preview-container" @click="toggleExpand">
              <template v-for="(item, index) in arrayCollapsedPreview" :key="index">
                <span :class="item.class">{{ item.text }}</span>
                <span v-if="index < arrayCollapsedPreview.length - 1" class="preview-separator">, </span>
              </template>
            </span>
          </template>

          <!-- 对象预览 -->
          <template v-else-if="valueType === 'object'">
            <span class="preview-container" @click="toggleExpand">
              <template v-if="objectCollapsedPreview.length === 0">
                <span class="preview-empty">empty</span>
              </template>
              <template v-else>
                <template v-for="(item, index) in objectCollapsedPreview" :key="index">
                  <template v-if="!item.isMore">
                    <span class="key-name">{{ item.key }}</span>
                    <span class="preview-colon">: </span>
                    <span v-if="item.value.isHtml" :class="item.value.class" v-html="item.value.text" />
                    <span v-else :class="item.value.class">{{ item.value.text }}</span>
                  </template>
                  <template v-else>
                    <span :class="item.value.class">{{ item.value.text }}</span>
                  </template>
                  <span v-if="index < objectCollapsedPreview.length - 1" class="preview-separator">, </span>
                </template>
              </template>
            </span>
          </template>

          <span class="bracket" @click="toggleExpand">{{ closeBracket }}</span>
          <span v-if="!isLastItem && depth > 0" class="comma">,</span>
        </template>
      </div>

      <!-- 展开的内容 -->
      <div v-if="isExpanded" class="node-content font-mono">
        <div class="vertical-line" />
        <JsonNode
          v-for="(key, index) in entryKeys" :key="key" ref="childNodes"
          :value="valueType === 'array' ? (value as unknown[])[key as number] : (value as Record<string, unknown>)[key]"
          :key-name="key" :depth="depth + 1" :default-expanded="defaultExpanded"
          :is-last-item="index === entryKeys.length - 1" style="padding-left: 32px"
        />
        <div class="node-footer">
          <span class="bracket">{{ closeBracket }}</span>
          <span v-if="!isLastItem && depth > 0" class="comma">,</span>
        </div>
      </div>
    </template>

    <!-- 基础类型 -->
    <template v-else>
      <div class="node-primitive">
        <span v-if="keyName !== null" class="key-wrapper" :class="keyClass">
          <span>{{ keyName }}</span>
          <span>:&nbsp;</span>
        </span>
        <span :class="valueClass" v-html="formattedValue" />
        <span v-if="!isLastItem" class="comma">,</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.json-node {
  position: relative;
  margin: 2px 0;
}

.json-node:not(.has-collapse-btn) .node-header:hover {
  background-color: rgba(187,187,187,.25);
}

.node-header {
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: 4px;
}

.node-content {
  position: relative;
  padding-left: 0;
}

.node-content>.json-node {
  position: relative;
}

.vertical-line {
  position: absolute;
  left: 4px;
  top: 0;
  bottom: 24px;
  width: 1px;
}

.theme-dark .vertical-line {
 background: linear-gradient(to bottom,#bbbbbb26,#bbbbbb26);
}

.theme-light .vertical-line {
  background: linear-gradient(to bottom,#bbbbbb26,#bbbbbb26);
}

.node-footer,
.node-primitive {
  display: flex;
  align-items: center;
}

.key-wrapper {
  display: flex;
}

/* 数字分隔符 */
:deep(.num-delim) {
  padding-left: 2px;
}

/* 数量标签 */
.count-label {
  margin-left: 4px;
  font-size: 11px;
}

.theme-dark .count-label {
  color: #999;
}

.theme-light .count-label {
  color: #999;
}

/* 预览容器 */
.preview-container {
  cursor: pointer;
  user-select: none;
}

.preview-separator,
.preview-colon {
  user-select: none;
}

.theme-dark .preview-separator,
.theme-dark .preview-colon {
  color: #d4d4d4;
}

.theme-light .preview-separator,
.theme-light .preview-colon {
  color: #24292e;
}

.theme-dark .preview-empty,
.theme-dark .preview-more {
  color: #858585;
}

.theme-light .preview-empty,
.theme-light .preview-more {
  color: #6a737d;
}

/* 逗号 */
.comma {
  margin-left: 0;
  user-select: none;
}

.theme-dark .comma {
  color: #d4d4d4;
}

.theme-light .comma {
  color: #24292e;
}

/* 折叠按钮 */
.collapse-btn {
  @apply text-[10px] w-4.5 h-4.5 flex items-center justify-center rounded-md cursor-pointer;
}

.theme-dark .collapse-btn {
  color: #858585;
  border: 1px solid #36363a;
}

.theme-dark .collapse-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
  border-color: #858585;
}

.theme-light .collapse-btn {
  color: #6a737d;
  border: 1px solid #e1e4e8;
}

.theme-light .collapse-btn:hover {
  color: #24292e;
  background: rgba(0, 0, 0, 0.05);
  border-color: #959da5;
}

.collapse-icon {
  user-select: none;
  display: inline-block;
}

/* 键名样式 */
.theme-dark .key-name {
  color: #9cdcfe;
  font-weight: 500;
}

.theme-dark .key-index {
  color: #858585;
  font-weight: 400;
}

.theme-light .key-name {
  color: var(--json-fmt-property-color);
}

.theme-light .key-index {
  color: #6a737d;
  font-weight: 400;
}

/* 括号 */
.bracket {
  user-select: none;
}

.theme-dark .bracket {
  color: #d4d4d4;
}

.theme-light .bracket {
  color: #24292e;
}

/* 值类型样式 - 暗色主题 */
.theme-dark .value-string {
  color: #ce9178;
}

.theme-dark .value-number {
  color: #b5cea8;
}

.theme-dark .value-boolean {
  color: #b5cea8;
}

.theme-dark .value-null,
.theme-dark .value-undefined {
  color: #bd6476;
}

.theme-dark .value-array,
.theme-dark .value-object {
  color: #858585;
}

/* 值类型样式 - 亮色主题 */
.theme-light .value-string {
  color: var(--json-fmt-string-color);
}

.theme-light .value-number {
  color: var(--json-fmt-number-color);
}

.theme-light .value-boolean {
  color: var(--json-fmt-atom-color);
}

.theme-light .value-null,
.theme-light .value-undefined {
  color: #6f42c1;
}

.theme-light .value-array,
.theme-light .value-object {
  color: #6a737d;
}
</style>
