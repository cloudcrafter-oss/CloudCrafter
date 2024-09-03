import { getServers } from '@/src/core/__generated__'
import { ServersList } from '@/src/core/features/admin/servers/list.tsx'
import { addBreadcrumb, resetBreadcrumbs } from '@/src/utils/breadcrumbs'

export default async function Page() {
	resetBreadcrumbs()
	addBreadcrumb('Admin', '/admin')
	addBreadcrumb('Servers', '/admin/servers')

	const servers = await getServers()
	return <ServersList servers={servers} />
}
