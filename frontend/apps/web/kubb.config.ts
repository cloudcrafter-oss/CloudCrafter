import { defineConfig } from '@kubb/core'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginTanstackQuery } from '@kubb/swagger-tanstack-query'
import { pluginTs } from '@kubb/swagger-ts'
import { pluginZod } from '@kubb/swagger-zod'
import { pluginClient } from '@kubb/swagger-client'


export default defineConfig({
    root: '.',
    input: {
        path: 'http://localhost:57680/swagger/v1/swagger.json'
    },
    output: {
        path: './src/core/generated',
        clean: true,
    },
    hooks: {
        done: [
            'node src/utils/kubb/post-action.js',
            'eslint ./src/core/generated --ext ts --fix'
        ]
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
        pluginClient({
            output: {
                path: './axios'
            },
            client: { importPath: '../../backend/client.ts' }
        }),
        pluginTs(),
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
