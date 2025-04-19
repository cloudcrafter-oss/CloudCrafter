'use client'

import type { SimpleTeamDto } from '@cloudcrafter/api'
import { useDeleteTeamHook } from '@cloudcrafter/api'
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
import { CloudCrafterTable } from '@cloudcrafter/ui/custom-components/cloudcrafter-table'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { AddTeamSheet } from './add-team-sheet'
import { getColumns } from './columns'

interface TeamsTableProps {
	teams: SimpleTeamDto[]
}

export function TeamsTable({ teams }: TeamsTableProps) {
	const [showEditTeamSheet, setShowEditTeamSheet] = useState(false)
	const [showDeleteTeamSheet, setShowDeleteTeamSheet] = useState(false)
	const [selectedTeam, setSelectedTeam] = useState<SimpleTeamDto | null>(null)
	const router = useRouter()
	const refresh = () => {
		router.refresh()
	}

	const deleteMutation = useDeleteTeamHook({
		mutation: {
			onSuccess: () => {
				toast.success('Team deleted successfully')
				setShowDeleteTeamSheet(false)
				refresh()
			},
			onError: () => {
				toast.error('Failed to delete team')
			},
		},
	})

	const handleDelete = () => {
		if (selectedTeam) {
			deleteMutation.mutate({ teamId: selectedTeam.id })
		}
	}

	// Memoize the columns so they don't re-render on every render
	const columns = React.useMemo(
		() =>
			getColumns({
				onEditClick: (team) => {
					setSelectedTeam(team)
					setShowEditTeamSheet(true)
				},
				onDeleteClick: (team) => {
					setSelectedTeam(team)
					setShowDeleteTeamSheet(true)
				},
			}),
		[],
	)

	return (
		<div className='space-y-4'>
			<div className='flex justify-end'>
				<Button onClick={() => toast.success('Hello')}>Hallo</Button>
				<AddTeamSheet
					open={showEditTeamSheet}
					setOpen={setShowEditTeamSheet}
					onSuccess={refresh}
					team={selectedTeam}
				/>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Teams</CardTitle>
				</CardHeader>
				<CardContent>
					<CloudCrafterTable
						data={teams}
						addButton={{
							label: 'Add Teams',
							onClick: () => {
								setSelectedTeam(null)
								setShowEditTeamSheet(true)
							},
						}}
						columns={columns}
						showColumnVisibility={true}
						showRowSelection={true}
					/>
				</CardContent>
			</Card>

			<AlertDialog
				open={showDeleteTeamSheet}
				onOpenChange={setShowDeleteTeamSheet}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the team "{selectedTeam?.name}". This
							action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}
