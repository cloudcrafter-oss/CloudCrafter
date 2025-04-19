import type { SimpleTeamDto } from '@cloudcrafter/api'
import { Button } from '@cloudcrafter/ui/components/button'
import type { ColumnDef } from '@tanstack/react-table'
import { PencilIcon } from 'lucide-react'

interface GetColumnsProps {
	onEditClick: (team: SimpleTeamDto) => void
}

export const getColumns = ({
	onEditClick,
}: GetColumnsProps): ColumnDef<SimpleTeamDto>[] => [
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
	{
		accessorKey: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			return (
				<div className='flex items-center gap-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={() => onEditClick(row.original)}
					>
						<PencilIcon className='h-4 w-4' />
					</Button>
				</div>
			)
		},
	},
]
