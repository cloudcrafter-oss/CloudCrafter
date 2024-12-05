'use client'

import type { DataTableFilterOption } from '@/src/components/datatable/types'
import {
	CaretSortIcon,
	ChevronDownIcon,
	PlusIcon,
	TextIcon,
} from '@radix-ui/react-icons'
import { Button } from '@cloudcrafter/ui/components/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@cloudcrafter/ui/components/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@cloudcrafter/ui/components/popover'
import * as React from 'react'

interface DataTableFilterComboboxProps<TData> {
	options: DataTableFilterOption<TData>[]
	selectedOptions: DataTableFilterOption<TData>[]
	setSelectedOptions: React.Dispatch<
		React.SetStateAction<DataTableFilterOption<TData>[]>
	>
	onSelect: () => void
	children?: React.ReactNode
}

export function DataTableFilterCombobox<TData>({
	options,
	selectedOptions,
	setSelectedOptions,
	onSelect,
	children,
}: DataTableFilterComboboxProps<TData>) {
	const [value, setValue] = React.useState('')
	const [open, setOpen] = React.useState(false)
	const [selectedOption, setSelectedOption] = React.useState<
		DataTableFilterOption<TData>
	>(options[0] ?? ({} as DataTableFilterOption<TData>))

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				{children ?? (
					<Button
						variant='outline'
						size='sm'
						role='combobox'
						className='capitalize'
					>
						<CaretSortIcon
							className='mr-2 size-4 shrink-0'
							aria-hidden='true'
						/>
						Filter
					</Button>
				)}
			</PopoverTrigger>
			<PopoverContent className='w-[12.5rem] p-0' align='end'>
				<Command>
					<CommandInput placeholder='Filter by...' />
					<CommandList>
						<CommandEmpty>No item found.</CommandEmpty>
						<CommandGroup>
							{options
								.filter(
									(option) =>
										!selectedOptions.some(
											(selectedOption) => selectedOption.value === option.value,
										),
								)
								.map((option) => (
									<CommandItem
										key={String(option.value)}
										className='capitalize'
										value={String(option.value)}
										onSelect={(currentValue) => {
											setValue(currentValue === value ? '' : currentValue)
											setOpen(false)
											setSelectedOption(option)
											setSelectedOptions((prev) => {
												return [...prev, { ...option }]
											})
											onSelect()
										}}
									>
										{option.options.length > 0 ? (
											<ChevronDownIcon
												className='mr-2 size-4'
												aria-hidden='true'
											/>
										) : (
											<TextIcon className='mr-2 size-4' aria-hidden='true' />
										)}
										{option.label}
									</CommandItem>
								))}
						</CommandGroup>
						<CommandSeparator />
						<CommandGroup>
							<CommandItem
								onSelect={() => {
									setOpen(false)
									setSelectedOptions([
										...selectedOptions,
										{
											id: crypto.randomUUID(),
											label: selectedOption?.label ?? '',
											value: selectedOption?.value ?? '',
											options: selectedOption?.options ?? [],
											isMulti: true,
										},
									])
									onSelect()
								}}
							>
								<PlusIcon className='mr-2 size-4' aria-hidden='true' />
								Advanced filter
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
