'use server'

import { TeamsTable } from '@/src/core/features/admin/teams/table'
import { getAllTeams } from '@cloudcrafter/api'
export default async function Page() {
	const teams = await getAllTeams()

	return (
		<div className='container mx-auto p-6'>
			<TeamsTable teams={teams} />
		</div>
	)
}
