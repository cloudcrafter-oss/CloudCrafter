import generate from './api-client/generator';

export default async function runExecutor() {

  await generate({
    url: 'https://localhost:57679/swagger/v1/swagger.json',
    outputPath: './src/api-client.ts'
  })

  return {
    success: true
  }
}
