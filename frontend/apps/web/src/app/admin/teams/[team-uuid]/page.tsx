import type { TeamRouteParams } from '@/src/utils/routes/schemas'
import { TeamMembersTable } from './components/TeamMembersTable'

interface PageProps {
	params: TeamRouteParams
}

export default async function TeamPage({ params }: PageProps) {
	return <TeamMembersTable teamUuid={params['team-uuid']} />
}
