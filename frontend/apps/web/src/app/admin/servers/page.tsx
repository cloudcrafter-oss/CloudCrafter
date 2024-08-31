import { ServersList } from '@/src/core/features/admin/servers/list.tsx'
import { getServers } from '@/src/core/generated'
import { addBreadcrumb, resetBreadcrumbs } from '@/src/utils/breadcrumbs'

export default async function Page() {
	resetBreadcrumbs()
	addBreadcrumb('Admin', '/admin')
	addBreadcrumb('Servers', '/admin/servers')

	const servers = await getServers()
	return <ServersList servers={servers} />
}
