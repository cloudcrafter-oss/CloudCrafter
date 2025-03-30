import { writeFileSync } from 'node:fs'

async function fetchOpenApiSpec() {
	try {
		console.log('Fetching OpenAPI specification...')

		const response = await fetch(
			'http://backend-7f000001.nip.io/openapi/v1.json',
		)

		if (!response.ok) {
			throw new Error(
				`Failed to fetch: ${response.status} ${response.statusText}`,
			)
		}

		const data = await response.json()

		// Write the specification to a file
		writeFileSync('openapi-spec.json', JSON.stringify(data, null, 2))

		console.log('Successfully saved OpenAPI specification to openapi-spec.json')
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error('Error:', error.message)
		} else {
			console.error('Error:', String(error))
		}
		process.exit(1)
	}
}

// Execute the function
fetchOpenApiSpec()
