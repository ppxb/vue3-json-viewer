export const jsonNodeProps = {
  value: {
    type: null,
    default: null,
  },
  keyName: {
    type: [String, Number],
    default: null,
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
} as const
