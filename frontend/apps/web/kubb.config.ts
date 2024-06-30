import { defineConfig } from '@kubb/core'
import { pluginZod } from '@kubb/swagger-zod'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginTanstackQuery } from '@kubb/swagger-tanstack-query'
import { pluginTs } from '@kubb/swagger-ts'

export default defineConfig({
    root: '.',
    input: {
        path: 'http://localhost:57680/swagger/v1/swagger.json'
    },
    output: {
        path: './src/app/generated',
        clean: true,
    },
    plugins: [
        pluginOas({ output: false }),
        pluginZod({
            output: {
                path: './zod',
            },
            mapper: {
                productName: 'z.string().uuid()',
            },
        }),
        pluginTs({}),
        pluginTanstackQuery({
            transformers: {
                name: (name, type) => {
                    if (type === 'file' || type === 'function') {
                        return `${name}Hook`
                    }
                    return name
                },
            },
            output: {
                path: './hooks',
            },
            framework: 'react',
            infinite: {},
        }),
    ]
})
