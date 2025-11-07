<script setup lang="ts">
import { computed, ref } from 'vue'

import JsonNode from './JsonNode.vue'

const props = withDefaults(defineProps<{
  json: string
  defaultExpanded?: boolean
}>(), {
  defaultExpanded: true,
})

const rootNode = ref<InstanceType<typeof JsonNode> | null>(null)

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

function expandAll() {
  rootNode.value?.expandAll()
}

function collapseAll() {
  rootNode.value?.collapseAll()
}

async function copyJson() {
  try {
    await navigator.clipboard.writeText(JSON.stringify(parsedJSON.value))
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
  <div
    class="text-3 p2 rounded-lg overflow-auto whitespace-nowrap bg-white dark:bg-[#1c1e23]"
    border="~ solid #e1e4e8 dark:#36363a"
  >
    <div v-if="parseError" class="json-error">
      <span>⚠️</span>
      <span>{{ parseError }}</span>
    </div>
    <JsonNode
      v-else
      ref="rootNode"
      :value="parsedJSON"
      :key-name="null"
      :depth="0"
      :default-expanded="defaultExpanded"
    />
  </div>
</template>

<style scoped>
.theme-dark .json-error {
  @apply color-[#f48771] bg-[rgba(244,135,113,0.1)];
}

.theme-light .json-error {
  @apply color-[#f48771] bg-[rgba(215,58,73,0.1)];
}

.json-error {
  @apply flex items-center gap2 p2 font-bold rounded-md;
}
</style>
