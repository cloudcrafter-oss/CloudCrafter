'use client'

import type { SimpleTeamDto } from '@cloudcrafter/api'
import { CloudCrafterTable } from '@cloudcrafter/ui/custom-components/cloudcrafter-table'
import React from 'react'
import { getColumns } from './columns'

interface TeamsTableProps {
	teams: SimpleTeamDto[]
}

export function TeamsTable({ teams }: TeamsTableProps) {
	// Memoize the columns so they don't re-render on every render
	const columns = React.useMemo(() => getColumns(), [])

	return (
		<CloudCrafterTable
			data={teams}
			columns={columns}
			showColumnVisibility={true}
			showRowSelection={true}
		/>
	)
}
