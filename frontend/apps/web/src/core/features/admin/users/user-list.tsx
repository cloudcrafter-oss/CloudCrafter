import { getUsers } from '@/src/core/__generated__'
import { TasksTableProvider } from '@/src/core/features/admin/users/provider.tsx'
import type { SearchParams } from 'nuqs/parsers'
import React from 'react'

import { DataTableSkeleton } from '@/src/components/datatable/components/data-table/data-table-skeleton.tsx'
import { searchParamsSchema } from '@/src/components/datatable/validation'
import { UsersTable } from '@/src/core/features/admin/users/table.tsx'

export interface UserListProps {
	searchParams: SearchParams
}

export const UsersList = async ({ searchParams }: UserListProps) => {
	const search = searchParamsSchema.parse(searchParams)

	const users = getUsers({
		page: search.page,
		pageSize: search.per_page,
		filters: [],
	})

	return (
		<TasksTableProvider>
			<React.Suspense
				fallback={
					<DataTableSkeleton
						columnCount={5}
						searchableColumnCount={1}
						filterableColumnCount={2}
						cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem']}
						shrinkZero
					/>
				}
			>
				{/**
				 * Passing promises and consuming them using React.use for triggering the suspense fallback.
				 * @see https://react.dev/reference/react/use
				 */}
				<UsersTable usersPromise={users} />
			</React.Suspense>
		</TasksTableProvider>
	)
}
