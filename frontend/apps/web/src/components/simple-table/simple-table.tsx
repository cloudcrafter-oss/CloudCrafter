'use client'

import { Button } from '@cloudcrafter/ui/components/button'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@cloudcrafter/ui/components/dropdown-menu'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@cloudcrafter/ui/components/table'
import type {
	ColumnDef,
	PaginationOptions,
	PaginationState,
	VisibilityState,
} from '@tanstack/react-table'
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface PaginationData<TData> {
	page: number
	totalPages: number
	totalItems: number
	result: TData[]
}

interface SimpleTableProps<TData> {
	data?: PaginationData<TData>
	columns: ColumnDef<TData>[]
	pagination: PaginationState
	paginationOptions: Pick<PaginationOptions, 'onPaginationChange' | 'rowCount'>
	showColumnVisibility?: boolean
}

export function SimpleTable<TData>({
	data,
	columns,
	pagination,
	paginationOptions,
	showColumnVisibility = true,
}: SimpleTableProps<TData>) {
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const table = useReactTable({
		data: data?.result ?? [],
		columns,
		pageCount: data?.totalPages ?? 0,
		manualPagination: true,
		manualFiltering: true,
		manualSorting: true,
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			pagination,
			columnVisibility,
		},
		...paginationOptions,
		getCoreRowModel: getCoreRowModel(),
	})

	return (
		<div className='w-full'>
			<div className='flex items-center py-4'>
				{/* {searchColumn && (
                    <Input
                        placeholder={searchPlaceholder}
                        value={
                            (table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''
                        }
                        onChange={(event) =>
                            table.getColumn(searchColumn)?.setFilterValue(event.target.value)
                        }
                        className='max-w-sm'
                    />
                )} */}
				<div className='ml-auto flex items-center gap-2'>
					{/* {addButton && (
                        <Button onClick={addButton.onClick}>
                            {addButton.label ?? 'Add'}
                        </Button>
                    )} */}
					{showColumnVisibility && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant='outline'>
									Columns <ChevronDown />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end'>
								{table
									.getAllColumns()
									.filter((column) => column.getCanHide())
									.map((column) => {
										return (
											<DropdownMenuCheckboxItem
												key={column.id}
												className='capitalize'
												checked={column.getIsVisible()}
												onCheckedChange={(value) =>
													column.toggleVisibility(!!value)
												}
											>
												{column.id}
											</DropdownMenuCheckboxItem>
										)
									})}
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</div>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className='flex items-center justify-end space-x-2 py-4'>
				<div className='flex-1 text-sm text-muted-foreground'>
					Page {data?.page ?? 1} of {data?.totalPages ?? 1} (
					{data?.totalItems ?? 0} total items)
				</div>
				<div className='space-x-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant='outline'
						size='sm'
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	)
}
