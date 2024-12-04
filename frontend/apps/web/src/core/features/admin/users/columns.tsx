'use client'

import { DataTableColumnHeader } from '@/src/components/datatable/components/data-table/data-table-column-header.tsx'
import type { UserDto } from '@cloudcrafter/api/src/__generated__/types/UserDto'
import type { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@ui/components/ui/checkbox.tsx'

export function getColumns(): ColumnDef<UserDto>[] {
	return [
		{
			id: 'select',
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && 'indeterminate')
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label='Select all'
					className='translate-y-0.5'
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label='Select row'
					className='translate-y-0.5'
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: 'code',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title='Email' />
			),
			cell: ({ row }) => <div className='w-20'>{row.original.email}</div>,
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: 'fullName',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title='Name' />
			),
			cell: ({ row }) => <div>{row.original.fullName}</div>,
			enableSorting: false,
			enableHiding: false,
		},
		// {
		//     accessorKey: 'title',
		//     header: ({ column }) => (
		//         <DataTableColumnHeader column={column} title="Title"/>
		//     ),
		//     cell: ({ row }) => {
		//         const label = tasks.label.enumValues.find(
		//             (label) => label === row.original.label
		//         )
		//
		//         return (
		//             <div className="flex space-x-2">
		//                 {label && <Badge variant="outline">{label}</Badge>}
		//                 <span className="max-w-[31.25rem] truncate font-medium">
		//       {row.getValue('title')}
		//     </span>
		//             </div>
		//         )
		//     },
		// },
		// {
		//     accessorKey: 'status',
		//     header: ({ column }) => (
		//         <DataTableColumnHeader column={column} title="Status"/>
		//     ),
		//     cell: ({ row }) => {
		//         const status = tasks.status.enumValues.find(
		//             (status) => status === row.original.status
		//         )
		//
		//         if (!status) return null
		//
		//         const Icon = getStatusIcon(status)
		//
		//         return (
		//             <div className="flex w-[6.25rem] items-center">
		//                 <Icon
		//                     className="mr-2 size-4 text-muted-foreground"
		//                     aria-hidden="true"
		//                 />
		//                 <span className="capitalize">{status}</span>
		//             </div>
		//         )
		//     },
		//     filterFn: (row, id, value) => {
		//         return Array.isArray(value) && value.includes(row.getValue(id))
		//     },
		// },
		// {
		//     accessorKey: 'priority',
		//     header: ({ column }) => (
		//         <DataTableColumnHeader column={column} title="Priority"/>
		//     ),
		//     cell: ({ row }) => {
		//         const priority = tasks.priority.enumValues.find(
		//             (priority) => priority === row.original.priority
		//         )
		//
		//         if (!priority) return null
		//
		//         const Icon = getPriorityIcon(priority)
		//
		//         return (
		//             <div className="flex items-center">
		//                 <Icon
		//                     className="mr-2 size-4 text-muted-foreground"
		//                     aria-hidden="true"
		//                 />
		//                 <span className="capitalize">{priority}</span>
		//             </div>
		//         )
		//     },
		//     filterFn: (row, id, value) => {
		//         return Array.isArray(value) && value.includes(row.getValue(id))
		//     },
		// },
		// {
		//     accessorKey: 'createdAt',
		//     header: ({ column }) => (
		//         <DataTableColumnHeader column={column} title="Created At"/>
		//     ),
		//     cell: ({ cell }) => formatDate(cell.getValue() as Date),
		// },
		// {
		//     id: 'actions',
		//     cell: function Cell({ row }) {
		//         const [isUpdatePending, startUpdateTransition] = React.useTransition()
		//         const [showUpdateTaskSheet, setShowUpdateTaskSheet] =
		//             React.useState(false)
		//         const [showDeleteTaskDialog, setShowDeleteTaskDialog] =
		//             React.useState(false)
		//
		//         return (
		//             <>
		//                 <UpdateTaskSheet
		//                     open={showUpdateTaskSheet}
		//                     onOpenChange={setShowUpdateTaskSheet}
		//                     task={row.original}
		//                 />
		//                 <DeleteTasksDialog
		//                     open={showDeleteTaskDialog}
		//                     onOpenChange={setShowDeleteTaskDialog}
		//                     tasks={[row.original]}
		//                     showTrigger={false}
		//                     onSuccess={() => row.toggleSelected(false)}
		//                 />
		//                 <DropdownMenu>
		//                     <DropdownMenuTrigger asChild>
		//                         <Button
		//                             aria-label="Open menu"
		//                             variant="ghost"
		//                             className="flex size-8 p-0 data-[state=open]:bg-muted"
		//                         >
		//                             <DotsHorizontalIcon className="size-4" aria-hidden="true"/>
		//                         </Button>
		//                     </DropdownMenuTrigger>
		//                     <DropdownMenuContent align="end" className="w-40">
		//                         <DropdownMenuItem onSelect={() => setShowUpdateTaskSheet(true)}>
		//                             Edit
		//                         </DropdownMenuItem>
		//                         <DropdownMenuSub>
		//                             <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
		//                             <DropdownMenuSubContent>
		//                                 <DropdownMenuRadioGroup
		//                                     value={row.original.label}
		//                                     onValueChange={(value) => {
		//                                         startUpdateTransition(() => {
		//                                             toast.promise(
		//                                                 updateTask({
		//                                                     id: row.original.id,
		//                                                     label: value as Task['label'],
		//                                                 }),
		//                                                 {
		//                                                     loading: 'Updating...',
		//                                                     success: 'Label updated',
		//                                                     error: (err) => getErrorMessage(err),
		//                                                 }
		//                                             )
		//                                         })
		//                                     }}
		//                                 >
		//                                     {tasks.label.enumValues.map((label) => (
		//                                         <DropdownMenuRadioItem
		//                                             key={label}
		//                                             value={label}
		//                                             className="capitalize"
		//                                             disabled={isUpdatePending}
		//                                         >
		//                                             {label}
		//                                         </DropdownMenuRadioItem>
		//                                     ))}
		//                                 </DropdownMenuRadioGroup>
		//                             </DropdownMenuSubContent>
		//                         </DropdownMenuSub>
		//                         <DropdownMenuSeparator/>
		//                         <DropdownMenuItem
		//                             onSelect={() => setShowDeleteTaskDialog(true)}
		//                         >
		//                             Delete
		//                             <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
		//                         </DropdownMenuItem>
		//                     </DropdownMenuContent>
		//                 </DropdownMenu>
		//             </>
		//         )
		//     },
		// },
	]
}
