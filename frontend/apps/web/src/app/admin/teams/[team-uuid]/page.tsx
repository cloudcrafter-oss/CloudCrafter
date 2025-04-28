import { TeamMembersTable } from './components/TeamMembersTable'

export default function TeamPage({
	params,
}: { params: { 'team-uuid': string } }) {
	return <TeamMembersTable teamUuid={params['team-uuid']} />
}
