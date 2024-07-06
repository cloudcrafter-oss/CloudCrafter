import { SearchParams } from 'nuqs/parsers'
import { getUsers } from '@/src/core/generated'
import { TasksTableProvider } from '@/src/core/features/admin/users/provider.tsx'
import React from 'react'

import { TasksTable } from '@/src/core/features/admin/users/table.tsx'
import { Shell } from '@ui/components/ui/shell.tsx'
import { Skeleton } from '@ui/components/ui/skeleton.tsx'
import { z } from 'zod'
import { filterFilterSchema, searchParamsSchema } from '@/src/components/datatable/validation'
import { DateRangePicker } from '@/src/components/datatable/components/date-range-picker.tsx'
import { DataTableSkeleton } from '@/src/components/datatable/components/data-table/data-table-skeleton.tsx'


export interface UserListProps {
    searchParams: SearchParams
}

const test = (tata: z.infer<typeof filterFilterSchema>) => {
    console.log('test', { tata })

}

export const UsersList = async ({ searchParams }: UserListProps) => {
    const search = searchParamsSchema.parse(searchParams)

    console.log(search.filter)

    test(search['filter[]'])
    const users = getUsers({
        page: 1,
        pageSize: 10,
        filters: []
    })

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
                        // @ts-expect-error align is not a valid prop
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