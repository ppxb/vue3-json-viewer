import type { PropType } from 'vue'

export type JsonValue
  = | string
    | number
    | boolean
    | null
    | undefined
    | JsonValue[]
    | { [key: string]: JsonValue }

export const jsonNodeProps = {
  value: {
    type: [String, Number, Boolean, Object, Array] as PropType<JsonValue>,
    default: null,
  },
  keyName: {
    type: [String, Number] as PropType<string | number | null>,
    default: null,
    validator: (v: unknown) => v === null || typeof v === 'string' || typeof v === 'number',
  },
  depth: {
    type: Number,
    default: 0,
  },
  defaultExpanded: {
    type: Boolean,
    default: true,
  },
  isLastItem: {
    type: Boolean,
    default: false,
  },
}
