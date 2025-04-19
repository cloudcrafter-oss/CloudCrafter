'use server'

import { TeamsTable } from '@/src/core/features/admin/teams/table'
import { getAllTeams } from '@cloudcrafter/api'
export default async function Page() {
	const teams = await getAllTeams()

	return (
		<div className='container mx-auto py-10'>
			<div className='flex items-center justify-between'>
				<h1 className='text-3xl font-bold'>Teams</h1>
			</div>
			<div className='mt-8'>
				<TeamsTable teams={teams} />
			</div>
		</div>
	)
}
