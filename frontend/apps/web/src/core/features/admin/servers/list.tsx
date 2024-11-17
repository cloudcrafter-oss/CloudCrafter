'use client'
import {
	createServerCommandCommandSchema,
	getServersQueryKey,
	useCreateServerHook,
	useGetServersHook,
} from '@/src/core/__generated__'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@ui/components/ui/button'
import { Input } from '@ui/components/ui/input'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@ui/components/ui/sheet'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@ui/components/ui/table'
import {
	CircleIcon,
	GaugeIcon,
	HardDriveIcon,
	MemoryStickIcon,
} from 'lucide-react'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { useQueryClient } from '@tanstack/react-query'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@ui/components/ui/form'
import type { z } from 'zod'

const StateMap = {
	Offline: (
		<div className='flex items-center gap-2 text-sm text-muted-foreground'>
			<CircleIcon className='w-2 h-2 fill-red-500' />
			<span>Offline</span>
		</div>
	),
	Maintenance: (
		<div className='flex items-center gap-2 text-sm text-muted-foreground'>
			<CircleIcon className='w-2 h-2 fill-yellow-500' />
			<span>Maintenance</span>
		</div>
	),
	Online: (
		<div className='flex items-center gap-2 text-sm text-muted-foreground'>
			<CircleIcon className='w-2 h-2 fill-green-500' />
			<span>Online</span>
		</div>
	),
}

const formSchema = createServerCommandCommandSchema

export const ServersList = () => {
	const [open, setOpen] = useState(false)

	const queryClient = useQueryClient()

	const { data: servers } = useGetServersHook()

	const form = useForm<z.infer<typeof createServerCommandCommandSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
		},
	})

	const mutation = useCreateServerHook({
		mutation: {
			onSuccess: () => {
				form.reset()
				setOpen(false)
				queryClient.invalidateQueries({ queryKey: getServersQueryKey() })
			},
		},
	})

	const onSubmit = (data: z.infer<typeof formSchema>) => {
		mutation.mutate({ data })
	}

	const randomFromStateMap = () => {
		const keys = Object.keys(StateMap)
		// @ts-expect-error Todo: fix this
		return StateMap[keys[Math.floor(Math.random() * keys.length)]]
	}

	return (
		<div className='p-4 md:p-10 space-y-4'>
			<div className='flex justify-between items-center'>
				<h2 className='text-lg font-semibold'>Servers</h2>
				<Sheet open={open} onOpenChange={setOpen}>
					<SheetTrigger asChild>
						<Button>
							<PlusIcon className='w-4 h-4 mr-2' />
							Add Server
						</Button>
					</SheetTrigger>
					<SheetContent>
						<SheetHeader>
							<SheetTitle>Add New Server</SheetTitle>
						</SheetHeader>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className='space-y-4 mt-4'
							>
								<FormField
									control={form.control}
									name='name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Server Name</FormLabel>
											<FormControl>
												<Input placeholder='Enter server name' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type='submit'>Create Server</Button>
							</form>
						</Form>
					</SheetContent>
				</Sheet>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>CPU</TableHead>
						<TableHead>Memory</TableHead>
						<TableHead>Disk</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{servers?.map((server) => (
						<TableRow key={server.id}>
							<TableCell className='font-medium'>{server.name}</TableCell>
							<TableCell>{randomFromStateMap()}</TableCell>
							<TableCell>
								<div className='flex items-center gap-2'>
									<span>72%</span>
									<GaugeIcon className='w-4 h-4 text-muted-foreground' />
								</div>
							</TableCell>
							<TableCell>
								<div className='flex items-center gap-2'>
									<span>8.2 GB / 16 GB</span>
									<MemoryStickIcon className='w-4 h-4 text-muted-foreground' />
								</div>
							</TableCell>
							<TableCell>
								<div className='flex items-center gap-2'>
									<span>512 GB / 1 TB</span>
									<HardDriveIcon className='w-4 h-4 text-muted-foreground' />
								</div>
							</TableCell>
							<TableCell>
								<Link
									href={`/admin/servers/${server.id}`}
									className='text-primary hover:underline'
								>
									View Details
								</Link>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
