export function formatNumber(num: number): string {
  const str = String(num)
  const [integer, decimal] = str.split('.')
  const formatted = integer!.replace(/\B(?=(\d{3})+(?!\d))/g, '<span class="json-viewer__number-separator"></span>')
  return decimal ? `${formatted}.${decimal}` : formatted
}

export function getValueType(value: unknown): string {
  if (value === null) {
    return 'null'
  }
  if (Array.isArray(value)) {
    return 'array'
  }
  return typeof value
}

export function isComplexType(type: string): boolean {
  return type === 'object' || type === 'array'
}

export function formatValueForPreview(val: unknown, isNested = false) {
  if (val === null) {
    return { text: 'null', class: 'json-viewer__null' }
  }
  if (val === undefined) {
    return { text: 'undefined', class: 'json-viewer__undefined' }
  }
  if (typeof val === 'string') {
    return { text: `"${val}"`, class: 'json-viewer__string' }
  }
  if (typeof val === 'boolean') {
    return { text: String(val), class: 'json-viewer__boolean' }
  }
  if (typeof val === 'number') {
    return { text: formatNumber(val), class: 'json-viewer__number', isHtml: true }
  }
  if (Array.isArray(val)) {
    if (isNested && val.length > 0) {
      const items = Array.from({ length: Math.min(val.length, 4) }).fill('{…}')
      const suffix = val.length > 4 ? `, … ${val.length - 4} more` : ''
      return {
        text: `[${items.join(', ')}${suffix}]`,
        class: 'json-viewer__preview',
      }
    }
    return { text: '[…]', class: 'json-viewer__preview' }
  }
  if (typeof val === 'object') {
    return { text: '{…}', class: 'json-viewer__preview' }
  }
  return { text: String(val), class: '' }
}
