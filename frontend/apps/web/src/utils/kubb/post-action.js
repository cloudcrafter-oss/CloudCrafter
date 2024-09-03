import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'

async function fixUnusedVarsForPageParam(pattern) {
	console.log('Pattern:', pattern)
	try {
		const files = await fg(pattern)
		console.log('Files:', files)
		for (const file of files) {
			const data = await fs.promises.readFile(file, 'utf8')
			const lines = data.split('\n')

			const updatedLines = lines.map((line) => {
				if (line.includes('queryFn: async ({ pageParam })')) {
					return `// @ts-ignore pageParam is declared but its value is possibly never read\n${line}`
				}
				return line
			})

			const updatedData = updatedLines.join('\n')
			await fs.promises.writeFile(file, updatedData, 'utf8')
			console.log(`Updated ${file}`)
		}
	} catch (err) {
		console.error('Error:', err)
	}
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pattern = path
	.join(__dirname, '../../core/__generated__/**/*.*')
	.replace(/\\/g, '/')
fixUnusedVarsForPageParam(pattern)
