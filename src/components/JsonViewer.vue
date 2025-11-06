<script setup lang="ts">
import { computed, ref } from 'vue'

import JsonNode from './JsonNode.vue'

const props = withDefaults(defineProps<{
  jsonString: string
  defaultExpanded?: boolean
  theme?: 'dark' | 'light'
}>(), {
  defaultExpanded: true,
  theme: 'dark',
})

const rootNode = ref<InstanceType<typeof JsonNode> | null>(null)

const parsedData = computed(() => {
  try {
    return JSON.parse(props.jsonString)
  }
  catch {
    return null
  }
})

const parseError = computed(() => {
  if (parsedData.value === null && props.jsonString.trim()) {
    return 'Invalid JSON format'
  }
  return null
})

function expandAll() {
  rootNode.value?.expandAll()
}

function collapseAll() {
  rootNode.value?.collapseAll()
}

async function copyJson() {
  try {
    await navigator.clipboard.writeText(JSON.stringify(parsedData.value))
    return Promise.resolve(true)
  }
  catch (err) {
    return Promise.reject(err)
  }
}

defineExpose({
  expandAll,
  collapseAll,
  copyJson,
})
</script>

<template>
  <div class="json-viewer" :class="`theme-${theme}`">
    <div v-if="parseError" class="json-error">
      <span class="error-icon">⚠️</span>
      <span>{{ parseError }}</span>
    </div>
    <JsonNode
      v-else
      ref="rootNode"
      :value="parsedData"
      :key-name="null"
      :depth="0"
      :default-expanded="defaultExpanded"
    />
  </div>
</template>

<style scoped>
.json-viewer {
  font-size: 12px;
  padding: 8px;
  border-radius: 8px;
  overflow: auto;
}

/* 暗色主题 */
.theme-dark {
  background: #1e1e1e;
  color: #d4d4d4;
}

.theme-dark .json-error {
  color: #f48771;
  background: rgba(244, 135, 113, 0.1);
}

/* 亮色主题 */
.theme-light {
  background: #ffffff;
  color: #24292e;
  border: 1px solid #e1e4e8;
}

.theme-light .json-error {
  color: #d73a49;
  background: rgba(215, 58, 73, 0.1);
}

.json-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  font-weight: 700;
  border-radius: 6px;
}

.error-icon {
  font-size: 14px;
}
</style>
