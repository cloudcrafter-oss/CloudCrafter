import type { SimpleTeamDto } from '@cloudcrafter/api'
import type { ColumnDef } from '@tanstack/react-table'

export const getColumns = (): ColumnDef<SimpleTeamDto>[] => [
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => {
			return <div className='font-medium'>{row.getValue('name')}</div>
		},
	},
	{
		accessorKey: 'id',
		header: 'ID',
		cell: ({ row }) => {
			return <div className='font-mono text-sm'>{row.getValue('id')}</div>
		},
	},
]
