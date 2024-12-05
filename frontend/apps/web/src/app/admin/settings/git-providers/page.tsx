import { GitProvidersOverview } from '@/src/components/settings/git/providers/GitProvidersOverview'
import { getProviders } from '@cloudcrafter/api/__generated__/axios-backend'

export default async function GitProvidersPage() {
	const providers = await getProviders()

	return <GitProvidersOverview list={providers} />
}
