'use client'

import * as React from 'react'
import { getUsers, UserDto } from '@/src/core/generated'
import { useTasksTable } from '@/src/core/features/admin/users/provider.tsx'
import { getColumns } from '@/src/core/features/admin/users/columns.tsx'
import { DataTableFilterField } from '@repo/cloudcraft-datatable/src/types'
import { useDataTable } from '@repo/cloudcraft-datatable/src/hooks/use-data-table.ts'
import { DataTable } from '@repo/cloudcraft-datatable/src/components/data-table/data-table.tsx'


interface TasksTableProps {
    tasksPromise: ReturnType<typeof getUsers>
}

export function TasksTable({ tasksPromise }: TasksTableProps) {
    // Feature flags for showcasing some additional features. Feel free to remove them.
    const { featureFlags } = useTasksTable()

    const { result: data, totalPages: pageCount } = React.use(tasksPromise)

    // Memoize the columns so they don't re-render on every render
    const columns = React.useMemo(() => getColumns(), [])

    /**
     * This component can render either a faceted filter or a search filter based on the `options` prop.
     *
     * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
     *
     * Each `option` object has the following properties:
     * @prop {string} label - The label for the filter option.
     * @prop {string} value - The value for the filter option.
     * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
     * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
     */
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
            {/*    <DataTableAdvancedToolbar table={table} filterFields={filterFields}>*/}
            {/*        <TasksTableToolbarActions table={table}/>*/}
            {/*    </DataTableAdvancedToolbar>*/}
            {/*) : (*/}
            {/*    <DataTableToolbar table={table} filterFields={filterFields}>*/}
            {/*        <TasksTableToolbarActions table={table}/>*/}
            {/*    </DataTableToolbar>*/}
            {/*)}*/}
        </DataTable>
    )
}
