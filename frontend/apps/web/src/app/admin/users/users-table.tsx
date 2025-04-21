'use client'

import { type UserDto, useGetUsersHook } from '@cloudcrafter/api'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import { SimpleTable } from '@/src/components/simple-table/simple-table'
import { usePagination } from '@cloudcrafter/ui/hooks/use-pagination'

export function UsersTable() {
	const tablePagination = usePagination()
	const { data } = useGetUsersHook({
		Page: tablePagination.page,
		PageSize: tablePagination.pageSize,
	})

	const paginationState = {
		pageIndex: (tablePagination.page ?? 1) - 1,
		pageSize: tablePagination.pageSize ?? 10,
	}

	const columns: ColumnDef<UserDto>[] = [
		{
			accessorKey: 'fullName',
			header: 'Name',
		},
		{
			accessorKey: 'email',
			header: 'Email',
		},
		{
			accessorKey: 'createdAt',
			header: 'Created At',
			cell: ({ row }) => {
				return format(new Date(row.getValue('createdAt')), 'PPP')
			},
		},
	]

	return (
		<div className='space-y-4'>
			<SimpleTable<UserDto>
				paginationOptions={{
					onPaginationChange: (pagination) => {
						tablePagination.setFilters(
							typeof pagination === 'function'
								? pagination(paginationState)
								: pagination,
						)
					},
					rowCount: data?.result.length ?? 0,
				}}
				pagination={paginationState}
				data={data}
				columns={columns}
			/>
		</div>
	)
}
