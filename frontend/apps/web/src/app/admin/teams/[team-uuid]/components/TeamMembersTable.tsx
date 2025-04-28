'use client'

import { SimpleTable } from '@/src/components/simple-table/simple-table'
import { type TeamMemberDto, useGetTeamMembersHook } from '@cloudcrafter/api'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@cloudcrafter/ui/components/card'
import { usePagination } from '@cloudcrafter/ui/hooks/use-pagination'
import type { ColumnDef } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { AddTeamMemberDialog } from './AddTeamMemberDialog'

interface TeamMembersTableProps {
	teamUuid: string
}

export function TeamMembersTable({ teamUuid }: TeamMembersTableProps) {
	const tablePagination = usePagination()
	const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)

	const { data, refetch } = useGetTeamMembersHook(teamUuid, {
		Page: tablePagination.page,
		PageSize: tablePagination.pageSize,
	})

	const paginationState = {
		pageIndex: (tablePagination.page ?? 1) - 1,
		pageSize: tablePagination.pageSize ?? 10,
	}

	const columns: ColumnDef<TeamMemberDto>[] = [
		{
			accessorKey: 'fullName',
			header: 'Name',
		},
		{
			accessorKey: 'email',
			header: 'Email',
		},
	]

	// biome-ignore lint/correctness/useExhaustiveDependencies: on change, refetch the data
	useEffect(() => {
		refetch()
	}, [isAddMemberDialogOpen, refetch])

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Team Members</CardTitle>
				</CardHeader>
				<CardContent>
					<SimpleTable<TeamMemberDto>
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
						addButton={{
							label: 'Add Member',
							onClick: () => setIsAddMemberDialogOpen(true),
						}}
						columns={columns}
					/>
				</CardContent>
			</Card>

			<AddTeamMemberDialog
				open={isAddMemberDialogOpen}
				onOpenChange={setIsAddMemberDialogOpen}
				teamUuid={teamUuid}
			/>
		</>
	)
}
