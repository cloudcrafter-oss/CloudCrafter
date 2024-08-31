import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
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
					return (
						'// eslint-disable-next-line @typescript-eslint/ban-ts-comment\n// @ts-ignore pageParam is declared but its value is possibly never read\n' +
						line
					)
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
	.join(__dirname, '../../core/generated/**/*.*')
	.replace(/\\/g, '/')
fixUnusedVarsForPageParam(pattern)

const eslintConfigTypes = {
	rules: {
		'@typescript-eslint/no-explicit-any': 'off',
		//   '@typescript-eslint/ban-ts-comment': 'off'
	},
}

const eslintConfigHooks = {
	rules: {
		'@typescript-eslint/no-unused-vars': 'off',
	},
}

const jsonStringTypes = JSON.stringify(eslintConfigTypes, null, 2)
const jsongStringHooks = JSON.stringify(eslintConfigHooks, null, 2)
fs.writeFile(
	path.join(__dirname, '../../core/generated/types/.eslintrc'),
	jsonStringTypes,
	'utf8',
	(err) => {
		if (err) {
			console.error('Error writing file:', err)
			throw err
		} else {
			console.log('File has been saved.')
		}
	},
)

fs.writeFile(
	path.join(__dirname, '../../core/generated/hooks/.eslintrc'),
	jsongStringHooks,
	'utf8',
	(err) => {
		if (err) {
			console.error('Error writing file:', err)
			throw err
		} else {
			console.log('File has been saved.')
		}
	},
)

fetch('http://localhost:57680/api/System/get-fields')
	.then((response) => response.json())
	.then((data) => {
		const dtoFilters = {}

		Object.keys(data).forEach((dtoName) => {
			dtoFilters[dtoName] = data[dtoName]
		})

		const tsContent = `
export const DtoFilters = ${JSON.stringify(dtoFilters, null, 2)};
    `
		writeFile(tsContent)
	})
	.catch((error) => console.error('Error fetching data:', error))

// Mock function to simulate file writing (replace with actual file writing code)
function writeFile(content) {
	// write content to file

	const realPath = path.join(__dirname, '../../core/filtering/dto-filters.ts')
	console.error('writing!')
	fs.writeFileSync(realPath, content, 'utf8')
	console.log(`File written: ${realPath}`)
}
