import { theme } from 'frappe-ui/vitepress'
import type { Theme } from 'vitepress'
import PlatformDiagram from './PlatformDiagram.vue'
import CloudArchitecture from './CloudArchitecture.vue'
import './style.css'

export default {
  extends: theme,
  enhanceApp({ app }) {
    app.component('PlatformDiagram', PlatformDiagram)
    app.component('CloudArchitecture', CloudArchitecture)
  },
} satisfies Theme
