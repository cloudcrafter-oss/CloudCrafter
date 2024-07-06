import { getServers } from '@/src/core/generated'

export default async function Page() {
    const servers = await getServers()
    return <>
        <h1>Servers</h1>
        <pre>{JSON.stringify({ servers }, null, 2)}</pre>
    </>
}