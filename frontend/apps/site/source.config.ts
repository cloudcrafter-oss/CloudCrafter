import { defineConfig, defineDocs } from 'fumadocs-mdx/config'
import remarkGfm from 'remark-gfm'
import remarkMermaid from 'remark-mermaidjs'

export const { docs, meta } = defineDocs({
	dir: 'content/docs',
})

export default defineConfig({
	mdxOptions: {
		remarkPlugins: [remarkGfm, remarkMermaid],
	},
})
