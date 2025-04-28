'use client'

import { SimpleTable } from '@/src/components/simple-table/simple-table'
import {
	type TeamMemberDto,
	useGetTeamMembersHook,
	useRemoveUserFromTeamHook,
} from '@cloudcrafter/api'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@cloudcrafter/ui/components/alert-dialog'
import { Button } from '@cloudcrafter/ui/components/button'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@cloudcrafter/ui/components/card'
import { usePagination } from '@cloudcrafter/ui/hooks/use-pagination'
import type { ColumnDef } from '@tanstack/react-table'
import { Trash2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AddTeamMemberDialog } from './AddTeamMemberDialog'

interface TeamMembersTableProps {
	teamUuid: string
}

export function TeamMembersTable({ teamUuid }: TeamMembersTableProps) {
	const tablePagination = usePagination()
	const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
	const [memberToDelete, setMemberToDelete] = useState<TeamMemberDto | null>(
		null,
	)

	const { data, refetch } = useGetTeamMembersHook(teamUuid, {
		Page: tablePagination.page,
		PageSize: tablePagination.pageSize,
	})

	const { mutate: removeMember } = useRemoveUserFromTeamHook({
		mutation: {
			onSuccess: () => {
				toast.success('Team member removed successfully')
				refetch()
			},
			onError: () => {
				toast.error('Failed to remove team member')
			},
		},
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
		{
			id: 'actions',
			header: 'Actions',
			cell: ({ row }) => {
				const member = row.original
				return (
					<Button
						variant='destructive'
						size='sm'
						onClick={() => setMemberToDelete(member)}
					>
						<Trash2Icon className='h-4 w-4' />
					</Button>
				)
			},
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

			<AlertDialog
				open={!!memberToDelete}
				onOpenChange={(open) => !open && setMemberToDelete(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Remove Team Member</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to remove {memberToDelete?.fullName} (
							{memberToDelete?.email}) from the team? This action cannot be
							undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								if (memberToDelete?.email) {
									removeMember({
										teamId: teamUuid,
										data: {
											email: memberToDelete.email,
										},
									})
									setMemberToDelete(null)
								}
							}}
						>
							Remove
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
