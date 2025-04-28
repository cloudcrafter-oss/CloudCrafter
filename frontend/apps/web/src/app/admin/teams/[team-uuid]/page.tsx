import type { TeamRouteParams } from '@/src/utils/routes/schemas'
import { TeamMembersTable } from './components/TeamMembersTable'

interface PageProps {
	params: Promise<TeamRouteParams>
}

export default async function TeamPage({ params }: PageProps) {
	const resolvedParams = await params
	return <TeamMembersTable teamUuid={resolvedParams['team-uuid']} />
}
