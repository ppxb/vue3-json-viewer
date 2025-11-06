<script setup lang="ts">
import { ref } from 'vue'

import JsonViewer from './components/JsonViewer.vue'

const defaultExpanded = ref(true)
const theme = ref<'dark' | 'light'>('dark')
const jsonViewer = ref<InstanceType<typeof JsonViewer> | null>(null)
const copyStatus = ref<'idle' | 'success' | 'error'>('idle')

const example1 = JSON.stringify({
  code: '0',
  msg: 'success',
  success: true,
  timestamp: 1762328657458,
  data: {
    records: [{
      id: 1,
      username: 'user_1',
      email: 'user1@nextdoc4j.top',
      age: 27,
      phone: '13800000001',
      status: 'PENDING',
      createTime: '2025-08-05T07:44:17.458478031',
      updateTime: '2025-11-05T07:44:17.458544008',
    }, {
      id: 2,
      username: 'user_2',
      email: 'user2@nextdoc4j.top',
      age: 49,
      phone: '13800000002',
      status: 'INACTIVE',
      createTime: '2025-08-20T07:44:17.458582302',
      updateTime: '2025-11-05T07:44:17.458586781',
    }, {
      id: 3,
      username: 'user_3',
      email: 'user3@nextdoc4j.top',
      age: 44,
      phone: '13800000003',
      status: 'PENDING',
      createTime: '2025-06-21T07:44:17.458608533',
      updateTime: '2025-11-05T07:44:17.458612911',
    }, {
      id: 4,
      username: 'user_4',
      email: 'user4@nextdoc4j.top',
      age: 61,
      phone: '13800000004',
      status: 'INACTIVE',
      createTime: '2025-07-25T07:44:17.458633401',
      updateTime: '2025-11-05T07:44:17.45863823',
    }, {
      id: 5,
      username: 'user_5',
      email: 'user5@nextdoc4j.top',
      age: 51,
      phone: '13800000005',
      status: 'PENDING',
      createTime: '2025-09-17T07:44:17.458659391',
      updateTime: '2025-11-05T07:44:17.458663218',
    }, {
      id: 6,
      username: 'user_6',
      email: 'user6@nextdoc4j.top',
      age: 35,
      phone: '13800000006',
      status: 'ACTIVE',
      createTime: '2024-12-14T07:44:17.458681012',
      updateTime: '2025-11-05T07:44:17.458684639',
    }, {
      id: 7,
      username: 'user_7',
      email: 'user7@nextdoc4j.top',
      age: 46,
      phone: '13800000007',
      status: 'PENDING',
      createTime: '2025-01-25T07:44:17.458704217',
      updateTime: '2025-11-05T07:44:17.458707864',
    }, {
      id: 8,
      username: 'user_8',
      email: 'user8@nextdoc4j.top',
      age: 24,
      phone: '13800000008',
      status: 'PENDING',
      createTime: '2025-10-27T07:44:17.458726009',
      updateTime: '2025-11-05T07:44:17.458729596',
    }, {
      id: 9,
      username: 'user_9',
      email: 'user9@nextdoc4j.top',
      age: 36,
      phone: '13800000009',
      status: 'INACTIVE',
      createTime: '2025-07-21T07:44:17.458754624',
      updateTime: '2025-11-05T07:44:17.458760145',
    }, {
      id: 10,
      username: 'user_10',
      email: 'user10@nextdoc4j.top',
      age: 57,
      phone: '13800000010',
      status: 'INACTIVE',
      createTime: '2024-12-05T07:44:17.458778871',
      updateTime: '2025-11-05T07:44:17.458782588',
    }],
    total: 1000,
    current: 1,
    size: 10,
    pages: 100,
  },
}, null, 2)

const example2 = JSON.stringify({
  company: 'Tech Corp',
  founded: 2010,
  revenue: 1500000.50,
  isPublic: false,
  departments: [
    {
      name: 'Engineering',
      employees: [
        { id: 1, name: 'Alice', skills: ['TypeScript', 'Vue', 'Node.js'] },
        { id: 2, name: 'Bob', skills: ['Python', 'Django', 'PostgreSQL'] },
      ],
      budget: 500000,
    },
    {
      name: 'Marketing',
      employees: [
        { id: 3, name: 'Carol', skills: ['SEO', 'Content', 'Analytics'] },
      ],
      budget: 200000,
    },
  ],
  metadata: {
    created: '2025-01-01',
    updated: '2025-11-05',
    version: 2,
    archived: false,
  },
}, null, 2)

const jsonString = ref(example1)

function useExample1() {
  jsonString.value = example1
}

function useExample2() {
  jsonString.value = example2
}

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
  <div class="app">
    <div class="header">
      <h1>JSON Viewer</h1>
    </div>

    <div class="controls">
      <div class="control-group">
        <button @click="useExample1">
          User Data
        </button>
        <button @click="useExample2">
          Complex Nested Data
        </button>
      </div>

      <div class="control-group">
        <button @click="expandAll">
          📖 Expand All
        </button>
        <button @click="collapseAll">
          📕 Collapse All
        </button>
        <button
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
            📋 Copy JSON
          </template>
        </button>
        <button @click="toggleTheme">
          {{ theme === 'dark' ? '🌙 Dark' : '☀️ Light' }}
        </button>
      </div>
    </div>

    <JsonViewer
      ref="jsonViewer"
      :json-string="jsonString"
      :default-expanded="defaultExpanded"
      :theme="theme"
    />
  </div>
</template>

<style scoped>
.app {
  padding: 20px;
  margin: 0 auto;
  background: #cdcdcd1a;
}

.header {
  margin-bottom: 24px;
}

h1 {
  color: #333;
  margin: 0 0 8px 0;
  font-size: 32px;
}

.subtitle {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  border-radius: 8px;
}

.control-group {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.control-group label {
  font-size: 14px;
  font-weight: 600;
  color: #555;
  margin-right: 8px;
}

.controls button {
  padding: 8px 16px;
  background: #007acc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  font-weight: 500;
}

.controls button:hover {
  background: #005a9e;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 122, 204, 0.3);
}

/* 复制按钮的特殊状态 */
.controls button.copy-success {
  background: #28a745;
  animation: pulse 0.3s ease;
}

.controls button:active {
  transform: translateY(0);
}
</style>
