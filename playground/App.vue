<script setup lang="ts">
import type { JsonViewerExposed } from '../src'
import { useDark, useToggle } from '@vueuse/core'
import { ref } from 'vue'

import { JsonViewer } from '../src'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const defaultExpanded = ref(true)
const jsonViewer = ref<JsonViewerExposed | null>(null)
const copyStatus = ref<'idle' | 'success' | 'error'>('idle')

const jsonStr = ref(`{
  "code": "0",
  "msg": "success",
  "success": true,
  "timestamp": 1762328657458,
  "data": {
    "records": [
      {
        "id": 1,
        "username": "user_1",
        "email": "user1@nextdoc4j.top",
        "age": 27,
        "phone": "13800000001",
        "status": "PENDING",
        "createTime": "2025-08-05T07:44:17.458478031",
        "updateTime": "2025-11-05T07:44:17.458544008"
      },
      {
        "id": 2,
        "username": "user_2",
        "email": "user2@nextdoc4j.top",
        "age": 49,
        "phone": "13800000002",
        "status": "INACTIVE",
        "createTime": "2025-08-20T07:44:17.458582302",
        "updateTime": "2025-11-05T07:44:17.458586781"
      },
      {
        "id": 3,
        "username": "user_3",
        "email": "user3@nextdoc4j.top",
        "age": 44,
        "phone": "13800000003",
        "status": "PENDING",
        "createTime": "2025-06-21T07:44:17.458608533",
        "updateTime": "2025-11-05T07:44:17.458612911"
      }
    ],
    "total": 1000,
    "current": 1,
    "size": 10,
    "pages": 100
  }
}`)

function expandAll() {
  jsonViewer.value?.expandAll()
}

function collapseAll() {
  jsonViewer.value?.collapseAll()
}

async function copyJson() {
  if (!jsonViewer.value)
    return
  const success = await jsonViewer.value.copyJson()

  copyStatus.value = success ? 'success' : 'error'

  setTimeout(() => {
    copyStatus.value = 'idle'
  }, 2000)
}
</script>

<template>
  <div class="app-container">
    <div class="header">
      <h1 class="title">
        Vue3 JSON Viewer
      </h1>
      <div class="header-actions">
        <button class="btn" @click="expandAll">
          Expand All
        </button>
        <button class="btn" @click="collapseAll">
          Collapse All
        </button>
        <button
          class="btn copy-btn"
          :class="{
            'copy-success': copyStatus === 'success',
            'copy-error': copyStatus === 'error',
          }"
          @click="copyJson"
        >
          <template v-if="copyStatus === 'success'">
            ✓ Copied
          </template>
          <template v-else-if="copyStatus === 'error'">
            ✗ Error
          </template>
          <template v-else>
            Copy JSON
          </template>
        </button>
        <button class="btn" @click="toggleDark()">
          {{ isDark ? '☀️ Light' : '🌙 Dark' }}
        </button>
      </div>
    </div>

    <div class="content">
      <textarea
        v-model="jsonStr"
        class="json-input"
      />

      <JsonViewer
        ref="jsonViewer"
        class="json-viewer"
        :json="jsonStr"
        :default-expanded="defaultExpanded"
      />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  padding: 1rem;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #f1f1f1;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.title {
  font-size: 1.875rem;
  font-weight: bold;
}

.header-actions {
  padding: 0.5rem;
  display: flex;
  gap: 0.5rem;
}

.btn {
  font-size: 0.875rem;
  padding: 0.5rem;
  border: 1px solid #e1e4e8;
  border-radius: 0.5rem;
  background-color: white;
  cursor: pointer;
  border-style: solid;
}

.copy-btn.copy-success {
  background-color: #f0fff4;
  border-color: #4ade80;
  color: #16a34a;
}

.copy-btn.copy-error {
  background-color: #fff5f5;
  border-color: #f87171;
  color: #dc2626;
}

.content {
  display: flex;
  gap: 1rem;
  flex: 1;
  min-height: 0;
}

.json-input {
  font-size: 0.875rem;
  padding: 0.5rem;
  outline: none;
  border-radius: 0.5rem;
  flex: 1;
  height: 100%;
  border: 1px solid #e1e4e8;
  border-style: solid;
  resize: none;
  box-sizing: border-box;
}

.json-viewer {
  flex: 1;
}
</style>
