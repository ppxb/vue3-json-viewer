<script setup lang="ts">
import { ref } from 'vue'

import JsonViewer from './components/JsonViewer.vue'

const defaultExpanded = ref(true)
const theme = ref<'dark' | 'light'>('light')
const jsonViewer = ref<InstanceType<typeof JsonViewer> | null>(null)
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
      },
      {
        "id": 4,
        "username": "user_4",
        "email": "user4@nextdoc4j.top",
        "age": 61,
        "phone": "13800000004",
        "status": "INACTIVE",
        "createTime": "2025-07-25T07:44:17.458633401",
        "updateTime": "2025-11-05T07:44:17.45863823"
      },
      {
        "id": 5,
        "username": "user_5",
        "email": "user5@nextdoc4j.top",
        "age": 51,
        "phone": "13800000005",
        "status": "PENDING",
        "createTime": "2025-09-17T07:44:17.458659391",
        "updateTime": "2025-11-05T07:44:17.458663218"
      },
      {
        "id": 6,
        "username": "user_6",
        "email": "user6@nextdoc4j.top",
        "age": 35,
        "phone": "13800000006",
        "status": "ACTIVE",
        "createTime": "2024-12-14T07:44:17.458681012",
        "updateTime": "2025-11-05T07:44:17.458684639"
      },
      {
        "id": 7,
        "username": "user_7",
        "email": "user7@nextdoc4j.top",
        "age": 46,
        "phone": "13800000007",
        "status": "PENDING",
        "createTime": "2025-01-25T07:44:17.458704217",
        "updateTime": "2025-11-05T07:44:17.458707864"
      },
      {
        "id": 8,
        "username": "user_8",
        "email": "user8@nextdoc4j.top",
        "age": 24,
        "phone": "13800000008",
        "status": "PENDING",
        "createTime": "2025-10-27T07:44:17.458726009",
        "updateTime": "2025-11-05T07:44:17.458729596"
      },
      {
        "id": 9,
        "username": "user_9",
        "email": "user9@nextdoc4j.top",
        "age": 36,
        "phone": "13800000009",
        "status": "INACTIVE",
        "createTime": "2025-07-21T07:44:17.458754624",
        "updateTime": "2025-11-05T07:44:17.458760145"
      },
      {
        "id": 10,
        "username": "user_10",
        "email": "user10@nextdoc4j.top",
        "age": 57,
        "phone": "13800000010",
        "status": "INACTIVE",
        "createTime": "2024-12-05T07:44:17.458778871",
        "updateTime": "2025-11-05T07:44:17.458782588"
      }
    ],
    "total": 1000,
    "current": 1,
    "size": 10,
    "pages": 100
  }
}`)

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

function expandAll() {
  jsonViewer.value?.expandAll()
}

function collapseAll() {
  jsonViewer.value?.collapseAll()
}

async function copyJson() {
  const success = await jsonViewer.value?.copyJson()

  if (success) {
    copyStatus.value = 'success'
  }
  else {
    copyStatus.value = 'error'
  }

  setTimeout(() => {
    copyStatus.value = 'idle'
  }, 2000)
}
</script>

<template>
  <div
    p4 h-screen
    flex="~ col gap4"
    class="bg-[#cdcdcd1a]"
  >
    <div flex="~ justify-between items-center" font="mono bold">
      <h1 text-3xl font-bold>
        Vue3 JSON Viewer
      </h1>
      <div p2 flex="~ gap2">
        <button class="control-btn" @click="expandAll">
          Expand All
        </button>
        <button class="control-btn" @click="collapseAll">
          Collapse All
        </button>
        <button
          class="control-btn"
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
        <button class="control-btn" @click="toggleTheme">
          {{ theme === 'dark' ? '☀️ Light' : '🌙 Dark' }}
        </button>
      </div>
    </div>

    <div flex="~ gap4" flex-1 min-h-0>
      <textarea
        v-model="jsonStr"
        flex-1 h-full outline-none rounded-lg p2 font-mono text-sm
        border="~ solid #e1e4e8"
      />

      <JsonViewer
        ref="jsonViewer"
        class="flex-[2] h-full"
        :json="jsonStr"
        :default-expanded="defaultExpanded"
        :theme="theme"
      />
    </div>
  </div>
</template>

<style scoped>
.control-btn{
  @apply text-sm p2 rounded-lg cursor-pointer bg-white border border-solid border-[#e1e4e8];
}
</style>
