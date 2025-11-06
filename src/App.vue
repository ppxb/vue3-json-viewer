<script setup lang="ts">
import { ref } from 'vue'
import JsonViewer from './components/JsonViewer.vue'

const defaultExpanded = ref(true)
const theme = ref<'dark' | 'light'>('dark')
const jsonViewer = ref<InstanceType<typeof JsonViewer> | null>(null)
const copyStatus = ref<'idle' | 'success' | 'error'>('idle')

const example1 = JSON.stringify({ code: '0', msg: '操作成功', success: true, timestamp: 1762328657458, data: { records: [{ id: 1, username: 'user_1', email: 'user1@nextdoc4j.top', age: 27, phone: '13800000001', status: 'PENDING', createTime: '2025-08-05T07:44:17.458478031', updateTime: '2025-11-05T07:44:17.458544008' }, { id: 2, username: 'user_2', email: 'user2@nextdoc4j.top', age: 49, phone: '13800000002', status: 'INACTIVE', createTime: '2025-08-20T07:44:17.458582302', updateTime: '2025-11-05T07:44:17.458586781' }, { id: 3, username: 'user_3', email: 'user3@nextdoc4j.top', age: 44, phone: '13800000003', status: 'PENDING', createTime: '2025-06-21T07:44:17.458608533', updateTime: '2025-11-05T07:44:17.458612911' }, { id: 4, username: 'user_4', email: 'user4@nextdoc4j.top', age: 61, phone: '13800000004', status: 'INACTIVE', createTime: '2025-07-25T07:44:17.458633401', updateTime: '2025-11-05T07:44:17.45863823' }, { id: 5, username: 'user_5', email: 'user5@nextdoc4j.top', age: 51, phone: '13800000005', status: 'PENDING', createTime: '2025-09-17T07:44:17.458659391', updateTime: '2025-11-05T07:44:17.458663218' }, { id: 6, username: 'user_6', email: 'user6@nextdoc4j.top', age: 35, phone: '13800000006', status: 'ACTIVE', createTime: '2024-12-14T07:44:17.458681012', updateTime: '2025-11-05T07:44:17.458684639' }, { id: 7, username: 'user_7', email: 'user7@nextdoc4j.top', age: 46, phone: '13800000007', status: 'PENDING', createTime: '2025-01-25T07:44:17.458704217', updateTime: '2025-11-05T07:44:17.458707864' }, { id: 8, username: 'user_8', email: 'user8@nextdoc4j.top', age: 24, phone: '13800000008', status: 'PENDING', createTime: '2025-10-27T07:44:17.458726009', updateTime: '2025-11-05T07:44:17.458729596' }, { id: 9, username: 'user_9', email: 'user9@nextdoc4j.top', age: 36, phone: '13800000009', status: 'INACTIVE', createTime: '2025-07-21T07:44:17.458754624', updateTime: '2025-11-05T07:44:17.458760145' }, { id: 10, username: 'user_10', email: 'user10@nextdoc4j.top', age: 57, phone: '13800000010', status: 'INACTIVE', createTime: '2024-12-05T07:44:17.458778871', updateTime: '2025-11-05T07:44:17.458782588' }], total: 1000, current: 1, size: 10, pages: 100 } }, null, 2)

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

const example3 = JSON.stringify({
  title: 'API 响应示例',
  description: '这是一个以字符串数据为主的 JSON 示例',
  status: 'success',
  message: '数据获取成功',
  timestamp: '2025-11-05T14:30:00Z',
  user: {
    username: 'developer',
    displayName: '开发者',
    bio: '热爱编程，专注于前端开发，擅长 Vue.js 和 TypeScript',
    website: 'https://example.com',
    location: '北京, 中国',
  },
  posts: [
    {
      id: 'post_001',
      title: 'Vue 3 最佳实践',
      content: '在本文中，我们将探讨 Vue 3 组合式 API 的最佳实践...',
      author: '张三',
      tags: ['Vue', 'JavaScript', '前端开发'],
    },
    {
      id: 'post_002',
      title: 'TypeScript 类型体操',
      content: 'TypeScript 的类型系统非常强大，本文介绍一些高级技巧...',
      author: '李四',
      tags: ['TypeScript', '类型', '进阶'],
    },
  ],
  config: {
    apiEndpoint: 'https://api.example.com/v1',
    timeout: 30000,
    retryAttempts: 3,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      'X-Custom-Header': 'custom-value',
      'Base64': 'data:image/png;base64,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',
    },
  },
}, null, 2)

const jsonString = ref(example1)

function useExample1() {
  jsonString.value = example1
}

function useExample2() {
  jsonString.value = example2
}

function useExample3() {
  jsonString.value = example3
}

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

// 展开所有节点
function expandAll() {
  jsonViewer.value?.expandAll()
}

// 折叠所有节点
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

  // 2秒后重置状态
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
        <label>示例数据:</label>
        <button @click="useExample1">
          用户数据
        </button>
        <button @click="useExample2">
          复杂嵌套
        </button>
        <button @click="useExample3">
          字符串为主
        </button>
      </div>

      <div class="control-group">
        <label>操作:</label>
        <button @click="expandAll">
          📖 全部展开
        </button>
        <button @click="collapseAll">
          📕 全部折叠
        </button>
        <button
          :class="{
            'copy-success': copyStatus === 'success',
            'copy-error': copyStatus === 'error',
          }"
          @click="copyJson"
        >
          <template v-if="copyStatus === 'success'">
            ✓ 已复制
          </template>
          <template v-else-if="copyStatus === 'error'">
            ✗ 复制失败
          </template>
          <template v-else>
            📋 复制 JSON
          </template>
        </button>
        <button @click="toggleTheme">
          {{ theme === 'dark' ? '🌙 暗色' : '☀️ 亮色' }}
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
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
