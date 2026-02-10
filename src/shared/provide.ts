import type { InjectionKey } from 'vue'
import type { InjectedJsonViewer } from '@/components/JsonViewer/JsonViewer.types'

export const injectJsonViewer: InjectionKey<InjectedJsonViewer> = Symbol('jsonViewer')
