import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineDocsConfig } from '../../node_modules/frappe-ui/vitepress/index.node'
import { sidebar } from './sidebar'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const config = defineDocsConfig({
  rootDir,
  name: 'Cloud Platform',
  description: 'Understand how Frappe Cloud v2 fits together.',
  githubUrl: 'https://github.com/frappe/platform',
  base: process.env.DOCS_BASE || '/',
  sidebar,
  markdownConfig(md) {
    const fence = md.renderer.rules.fence
    md.renderer.rules.fence = (tokens, index, options, environment, renderer) => {
      const token = tokens[index]
      if (token.info.trim() === 'mermaid') {
        const chart = md.utils.escapeHtml(JSON.stringify(token.content))
        return `<PlatformDiagram :chart="${chart}" />`
      }
      return fence(tokens, index, options, environment, renderer)
    }
  },
})

config.vite!.server!.allowedHosts = ['.trycloudflare.com']
config.markdown!.container = { infoLabel: 'Note', warningLabel: 'Warning' }
config.vite!.plugins!.push({
  name: 'platform-docs-search',
  enforce: 'pre',
  resolveId(source, importer) {
    if (source === './CommandPalette.vue' && importer?.includes('/vitepress/components/Docs/')) {
      return path.join(rootDir, '.vitepress/theme/SearchPalette.vue')
    }
  },
})

export default config
