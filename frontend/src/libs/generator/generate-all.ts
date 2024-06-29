
import generateClient from "./api-client/generator.ts";


await generateClient({
    url: 'http://localhost:57680/swagger/v1/swagger.json',
    outputPath: './src/app/generated/api-client.ts'
})