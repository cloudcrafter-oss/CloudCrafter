import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import axios from 'axios'

async function clearDirectoryAndCreateFiles(directoryPath, apiUrl) {
	try {
		// Ensure the directory exists
		if (!fs.existsSync(directoryPath)) {
			fs.mkdirSync(directoryPath, { recursive: true })
		}

		// Clear the directory
		const files = fs.readdirSync(directoryPath)
		for (const file of files) {
			fs.unlinkSync(path.join(directoryPath, file))
		}

		console.log(`Cleared directory: ${directoryPath}`)

		// Fetch data from API
		const response = await axios.get(apiUrl)
		const data = response.data

		// Create files based on API response
		for (const [filename, content] of Object.entries(data)) {
			const filePath = path.join(directoryPath, filename)
			fs.writeFileSync(filePath, content)
			console.log(`Created file: ${filePath}`)
		}

		console.log('File creation completed successfully.')
	} catch (error) {
		console.error('An error occurred:', error)
	}
}

// Usage example

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const directoryPath = path
	.join(__dirname, '../../core/__generated__/signal-types')
	.replace(/\\/g, '/')
const apiUrl =
	'http://web.127.0.0.1.sslip.io/api/Development/generate-signalr-types'
clearDirectoryAndCreateFiles(directoryPath, apiUrl)
