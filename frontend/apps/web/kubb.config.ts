import { defineConfig } from '@kubb/core'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginTanstackQuery } from '@kubb/swagger-tanstack-query'
import { pluginTs } from '@kubb/swagger-ts'
import { pluginZod } from '@kubb/swagger-zod'


export default defineConfig({
    root: '.',
    input: {
        path: 'http://localhost:57680/api/specification.json'
    },
    output: {
        path: './src/app/generated',
        clean: true,
    },
    hooks: {
        done: [
            'node src/utils/kubb/post-action.js',
            'eslint ./src/app/generated --ext ts --fix'
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
