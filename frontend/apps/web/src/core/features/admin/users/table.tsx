'use client'

import { DataTableAdvancedToolbar } from '@/src/components/datatable/components/data-table/advanced/data-table-advanced-toolbar'
import { DataTable } from '@/src/components/datatable/components/data-table/data-table'
import { useDataTable } from '@/src/components/datatable/hooks/use-data-table'
import type { DataTableFilterField } from '@/src/components/datatable/types'
import { getColumns } from '@/src/core/features/admin/users/columns'
import { useTasksTable } from '@/src/core/features/admin/users/provider'
import type { getUsers } from '@cloudcrafter/api'
import type { UserDto } from '@cloudcrafter/api'
import * as React from 'react'

interface TasksTableProps {
	usersPromise: ReturnType<typeof getUsers>
}

export function UsersTable({ usersPromise }: TasksTableProps) {
	// Feature flags for showcasing some additional features. Feel free to remove them.
	const { featureFlags } = useTasksTable()

	const { result: data, totalPages: pageCount } = React.use(usersPromise)

	// Memoize the columns so they don't re-render on every render
	const columns = React.useMemo(() => getColumns(), [])

	const filterFields: DataTableFilterField<UserDto>[] = [
		{
			label: 'Email',
			value: 'email',
			placeholder: 'Filter email...',
		},
		// {
		//     label: 'Status',
		//     value: 'status',
		//     options: tasks.status.enumValues.map((status) => ({
		//         label: status[0]?.toUpperCase() + status.slice(1),
		//         value: status,
		//         icon: getStatusIcon(status),
		//         withCount: true,
		//     })),
		// },
		// {
		//     label: 'Priority',
		//     value: 'priority',
		//     options: tasks.priority.enumValues.map((priority) => ({
		//         label: priority[0]?.toUpperCase() + priority.slice(1),
		//         value: priority,
		//         icon: getPriorityIcon(priority),
		//         withCount: true,
		//     })),
		// },
	]

	const { table } = useDataTable({
		data,
		columns,
		pageCount,
		// optional props
		filterFields,
		enableAdvancedFilter: featureFlags.includes('advancedFilter'),
		defaultPerPage: 10,
		defaultSort: 'createdAt.desc',
	})

	return (
		<DataTable
			table={table}
			// floatingBar={
			//     featureFlags.includes('floatingBar') ? (
			//         <TasksTableFloatingBar table={table}/>
			//     ) : null
			// }
		>
			{/*{featureFlags.includes('advancedFilter') ? (*/}
			<DataTableAdvancedToolbar table={table} filterFields={filterFields}>
				{/*<TasksTableToolbarActions table={table}/>*/}
			</DataTableAdvancedToolbar>
			{/*) : (*/}
			{/*    <DataTableToolbar table={table} filterFields={filterFields}>*/}
			{/*        <TasksTableToolbarActions table={table}/>*/}
			{/*    </DataTableToolbar>*/}
			{/*)}*/}
		</DataTable>
	)
}
