import { SearchParams } from 'nuqs/parsers'
import { getUsers } from '@/src/core/generated'
import { TasksTableProvider } from '@/src/core/features/admin/users/provider.tsx'
import React from 'react'

import { UsersTable } from '@/src/core/features/admin/users/table.tsx'
import { Shell } from '@ui/components/ui/shell.tsx'
import { searchParamsSchema } from '@/src/components/datatable/validation'
import { DataTableSkeleton } from '@/src/components/datatable/components/data-table/data-table-skeleton.tsx'


export interface UserListProps {
    searchParams: SearchParams
}


export const UsersList = async ({ searchParams }: UserListProps) => {
    const search = searchParamsSchema.parse(searchParams)


    const users = getUsers({
        page: search.page,
        pageSize: search.per_page,
        filters: []
    })

    return (
        <Shell className="gap-2">
            {/**
             * The `TasksTableProvider` is use to enable some feature flags for the `TasksTable` component.
             * Feel free to remove this, as it's not required for the `TasksTable` component to work.
             */}
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
                    <UsersTable usersPromise={users}/>
                </React.Suspense>
            </TasksTableProvider>
        </Shell>
    )
}