import { defineConfig } from "vite";
import viteReact from '@vitejs/plugin-react'
import { fileURLToPath } from "url";
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        TanStackRouterVite(),
        viteReact(),
    ],
    resolve: {
        alias: [
            {
                find: "./runtimeConfig",
                replacement: "./runtimeConfig.browser",
            },
            // Reference: https://github.com/vercel/turbo/discussions/620#discussioncomment-2136195
            {
                find: "@ui",
                replacement: path.resolve(__dirname, "../../packages/ui/src"),
            },
        ],
    },
});
