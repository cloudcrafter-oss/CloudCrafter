'use client'

import type { SimpleTeamDto } from '@cloudcrafter/api'
import { CloudCrafterTable } from '@cloudcrafter/ui/custom-components/cloudcrafter-table'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { AddTeamSheet } from './add-team-sheet'
import { getColumns } from './columns'

interface TeamsTableProps {
	teams: SimpleTeamDto[]
}

export function TeamsTable({ teams }: TeamsTableProps) {
	// Memoize the columns so they don't re-render on every render
	const columns = React.useMemo(() => getColumns(), [])

	const [showEditTeamSheet, setShowEditTeamSheet] = useState(false)
	const router = useRouter()
	const refresh = () => {
		router.refresh()
	}

	return (
		<div className='space-y-4'>
			<div className='flex justify-end'>
				<AddTeamSheet
					open={showEditTeamSheet}
					setOpen={setShowEditTeamSheet}
					onSuccess={refresh}
				/>
			</div>
			<CloudCrafterTable
				data={teams}
				addButton={{
					label: 'Add Teams',
					onClick: () => {
						setShowEditTeamSheet(true)
					},
				}}
				columns={columns}
				showColumnVisibility={true}
				showRowSelection={true}
			/>
		</div>
	)
}
