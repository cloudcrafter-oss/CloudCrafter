import { SearchParams } from 'nuqs/parsers'
import { searchParamsSchema } from '@repo/cloudcraft-datatable/src/validation'
import { getUsers } from '@/src/core/generated'
import { TasksTableProvider } from '@/src/core/features/admin/users/provider.tsx'
import React from 'react'
import { DateRangePicker } from '@repo/cloudcraft-datatable/src/components/date-range-picker.tsx'
import { DataTableSkeleton } from '@repo/cloudcraft-datatable/src/components/data-table/data-table-skeleton.tsx'
import { TasksTable } from '@/src/core/features/admin/users/table.tsx'
import { Shell } from '@ui/components/ui/shell.tsx'
import { Skeleton } from '@ui/components/ui/skeleton.tsx'


export interface UserListProps {
    searchParams: SearchParams
}

export const UsersList = async ({ searchParams }: UserListProps) => {
    const search = searchParamsSchema.parse(searchParams)

    console.log(search)
    const users = getUsers()

    return (
        <Shell className="gap-2">
            {/**
             * The `TasksTableProvider` is use to enable some feature flags for the `TasksTable` component.
             * Feel free to remove this, as it's not required for the `TasksTable` component to work.
             */}
            <TasksTableProvider>
                {/**
                 * The `DateRangePicker` component is used to render the date range picker UI.
                 * It is used to filter the tasks based on the selected date range it was created at.
                 * The business logic for filtering the tasks based on the selected date range is handled inside the component.
                 */}
                <React.Suspense fallback={<Skeleton className="h-7 w-52"/>}>
                    <DateRangePicker
                        triggerSize="sm"
                        triggerClassName="ml-auto w-56 sm:w-60"
                        align='end'
                    />
                </React.Suspense>
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
                    <TasksTable tasksPromise={users}/>
                </React.Suspense>
            </TasksTableProvider>
        </Shell>
    )
}