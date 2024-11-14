import { GitProvidersOverview } from '@/src/components/settings/git/providers/GitProvidersOverview'
import { getProviders } from '@/src/core/__generated__'

export default async function GitProvidersPage() {
	const providers = await getProviders()

	return <GitProvidersOverview list={providers} />
}
