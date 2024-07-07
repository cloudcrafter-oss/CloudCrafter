import { getServers } from '@/src/core/generated'
import { ServersList } from '@/src/core/features/admin/servers/list.tsx'

export default async function Page() {
    const servers = await getServers()
    return <ServersList servers={servers}/>
}