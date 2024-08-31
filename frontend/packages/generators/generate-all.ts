import generateClient from './api-client/generate'

export async function generateAll() {
	await generateClient({
		url: 'http://localhost:57680/swagger/v1/swagger.json',
		outputPath: './src/app/generated/api-client.ts',
	})
}
