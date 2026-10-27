import { theme } from 'frappe-ui/vitepress'
import type { Theme } from 'vitepress'
import PlatformDiagram from './PlatformDiagram.vue'
import CloudArchitecture from './CloudArchitecture.vue'
import AppTrafficDiagram from './AppTrafficDiagram.vue'
import PilotVmDiagram from './PilotVmDiagram.vue'
import './style.css'

export default {
  extends: theme,
  enhanceApp({ app }) {
    app.component('PlatformDiagram', PlatformDiagram)
    app.component('CloudArchitecture', CloudArchitecture)
    app.component('AppTrafficDiagram', AppTrafficDiagram)
    app.component('PilotVmDiagram', PilotVmDiagram)
  },
} satisfies Theme
