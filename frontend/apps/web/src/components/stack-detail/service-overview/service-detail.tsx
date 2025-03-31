import { useUpdateStackServiceHook } from '@cloudcrafter/api'
import {
	type StackServiceDto,
	updateStackServiceCommandSchema,
} from '@cloudcrafter/api'
import { Button } from '@cloudcrafter/ui/components/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@cloudcrafter/ui/components/form'
import { Input } from '@cloudcrafter/ui/components/input'
import { Label } from '@cloudcrafter/ui/components/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@cloudcrafter/ui/components/select'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@cloudcrafter/ui/components/tabs'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	ChevronDown,
	Globe,
	HardDrive,
	Network,
	Plus,
	Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

// Mock data for demonstration
const mockVolumes: Volume[] = [
	{
		id: 'vol1',
		name: 'db-data',
		path: '/var/lib/postgresql/data',
		size: '1.2 GB',
		type: 'local' as const,
	},
	{
		id: 'vol2',
		name: 'app-logs',
		path: '/var/log/app',
		size: '450 MB',
		type: 'local' as const,
	},
	{
		id: 'vol3',
		name: 'redis-data',
		path: '/data',
		size: '250 MB',
		type: 'local' as const,
	},
]

interface Volume {
	id: string
	name: string
	path: string
	size: string
	type: 'local' | 'nfs'
}

export const ServiceDetail = ({
	stackId,
	service,
	toggleService,
	expandedService,
}: {
	stackId: string
	service: StackServiceDto
	toggleService: (serviceName: string) => void
	expandedService: string | null
}) => {
	const [volumes, setVolumes] = useState<Volume[]>(mockVolumes)
	const [isAddingVolume, setIsAddingVolume] = useState(false)
	const [editingVolume, setEditingVolume] = useState<Volume | null>(null)
	const [activeTab, setActiveTab] = useState('general')

	const form = useForm<z.infer<typeof updateStackServiceCommandSchema>>({
		resolver: zodResolver(updateStackServiceCommandSchema),
		defaultValues: {
			stackId: stackId,
			stackServiceId: service.id,
			name: service.name,
			domainName: service.httpConfiguration?.domainName,
			containerPortExposes: service.httpConfiguration?.containerHttpPort
				? Number(service.httpConfiguration.containerHttpPort)
				: undefined,
			containerHealthCheckPort: service.healthcheckConfiguration.httpPort
				? Number(service.healthcheckConfiguration.httpPort)
				: undefined,
		},
	})

	const volumeForm = useForm<Omit<Volume, 'id' | 'size'>>({
		defaultValues: {
			name: '',
			path: '',
			type: 'local',
		},
	})

	const formValues = form.watch()
	const formErrors = form.formState.errors

	const mutation = useUpdateStackServiceHook({
		mutation: {
			onSuccess: () => {
				toast.success('Service updated successfully')
			},
		},
	})

	const onSubmit = async (
		values: z.infer<typeof updateStackServiceCommandSchema>,
	) => {
		console.log(values)

		mutation.mutate({
			stackId: stackId,
			stackServiceId: service.id,
			data: values,
		})
	}

	const handleAddVolume = () => {
		setIsAddingVolume(true)
		volumeForm.reset()
	}

	const handleEditVolume = (volume: Volume) => {
		setEditingVolume(volume)
		volumeForm.reset({
			name: volume.name,
			path: volume.path,
			type: volume.type,
		})
	}

	const handleDeleteVolume = (id: string) => {
		setVolumes(volumes.filter((v) => v.id !== id))
	}

	const handleSaveVolume = (values: Omit<Volume, 'id' | 'size'>) => {
		if (editingVolume) {
			setVolumes(
				volumes.map((v) =>
					v.id === editingVolume.id ? { ...v, ...values, size: v.size } : v,
				),
			)
			setEditingVolume(null)
		} else {
			const newVolume: Volume = {
				id: `vol${volumes.length + 1}`,
				...values,
				size: '0 B',
			}
			setVolumes([...volumes, newVolume])
		}
		setIsAddingVolume(false)
		volumeForm.reset()
	}

	return (
		<div key={service.id} className='bg-card rounded-lg border'>
			<div className='p-3 sm:p-4'>
				<Button
					variant='ghost'
					className='w-full flex items-center justify-between hover:bg-accent/50'
					onClick={() => toggleService(service.name)}
				>
					<div className='flex items-center gap-2 sm:gap-3'>
						<div className='flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg border bg-background'>
							<HardDrive className='h-4 w-4 sm:h-5 sm:w-5' />
						</div>
						<div className='text-left'>
							<h3 className='font-medium text-sm sm:text-base'>
								{service.name}
							</h3>
							<p className='text-xs sm:text-sm text-muted-foreground truncate max-w-[180px] sm:max-w-none'>
								{service.httpConfiguration?.domainName ||
									'No domain configured'}
							</p>
						</div>
					</div>
					<ChevronDown
						className={`h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground transition-transform ${
							expandedService === service.name ? 'rotate-180' : ''
						}`}
					/>
				</Button>
			</div>

			{expandedService === service.name && (
				<div>
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className='w-full'
					>
						<div className='border-t border-b bg-accent/50 overflow-x-auto'>
							<TabsList className='h-12 w-full justify-start p-0 bg-transparent gap-2 sm:gap-6 px-3 sm:px-0'>
								<TabsTrigger
									value='general'
									className='flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium relative text-muted-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-foreground'
								>
									<Globe className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
									General
								</TabsTrigger>
								<TabsTrigger
									value='network'
									className='flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium relative text-muted-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-foreground'
								>
									<Network className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
									Network
								</TabsTrigger>
								<TabsTrigger
									value='storage'
									className='flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium relative text-muted-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-foreground'
								>
									<HardDrive className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
									Storage
								</TabsTrigger>
							</TabsList>
						</div>

						<div className='p-3 sm:p-6'>
							<TabsContent
								value='general'
								className='mt-0 space-y-4 sm:space-y-6'
							>
								<div>
									<h3 className='text-lg sm:text-xl font-semibold mb-4 sm:mb-6'>
										General Settings
									</h3>
									<Form {...form}>
										<form
											onSubmit={form.handleSubmit(onSubmit)}
											className='space-y-4'
										>
											<FormField
												control={form.control}
												name='name'
												render={({ field }) => (
													<FormItem>
														<FormLabel>Service Name</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value ?? ''}
																placeholder='Enter service name'
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<div className='flex justify-end'>
												<Button type='submit'>Save Changes</Button>
											</div>
										</form>
									</Form>
								</div>
							</TabsContent>

							<TabsContent
								value='network'
								className='mt-0 space-y-4 sm:space-y-6'
							>
								<div>
									<h3 className='text-lg sm:text-xl font-semibold mb-4 sm:mb-6'>
										Network Configuration
									</h3>
									<Form {...form}>
										<form
											onSubmit={form.handleSubmit(onSubmit)}
											className='space-y-4 sm:space-y-6'
										>
											<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6'>
												<FormField
													control={form.control}
													name='domainName'
													render={({ field }) => (
														<FormItem>
															<FormLabel>Domain Name</FormLabel>
															<FormControl>
																<Input
																	{...field}
																	value={field.value ?? ''}
																	placeholder='Enter domain name'
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<FormField
													control={form.control}
													name='containerPortExposes'
													render={({ field }) => (
														<FormItem>
															<FormLabel>Container Port</FormLabel>
															<FormControl>
																<Input
																	{...field}
																	value={field.value ?? ''}
																	type='number'
																	onChange={(e) =>
																		field.onChange(
																			e.target.value === ''
																				? undefined
																				: Number(e.target.value),
																		)
																	}
																	placeholder='Enter container port (e.g. 3000)'
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<FormField
													control={form.control}
													name='containerHealthCheckPort'
													render={({ field }) => (
														<FormItem className='sm:col-span-2'>
															<FormLabel>Health Check Port</FormLabel>
															<FormControl>
																<Input
																	{...field}
																	value={field.value ?? ''}
																	type='number'
																	onChange={(e) =>
																		field.onChange(
																			e.target.value === ''
																				? undefined
																				: Number(e.target.value),
																		)
																	}
																	placeholder='Enter health check port (e.g. 3000)'
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>

											<div className='flex justify-end'>
												<Button type='submit'>Save Changes</Button>
											</div>
										</form>
									</Form>
								</div>
							</TabsContent>

							<TabsContent value='storage' className='mt-0'>
								<div className='space-y-4 sm:space-y-6'>
									<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6'>
										<div className='space-y-1'>
											<h3 className='text-lg sm:text-xl font-semibold'>
												Storage Configuration
											</h3>
											<p className='text-xs sm:text-sm text-muted-foreground'>
												Configure persisted storage volumes for your service
											</p>
										</div>
										<Button
											variant='outline'
											size='sm'
											onClick={handleAddVolume}
											className='w-full sm:w-auto'
										>
											<Plus className='h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2' />
											Add Volume
										</Button>
									</div>

									{(isAddingVolume || editingVolume) && (
										<Form {...volumeForm}>
											<form
												onSubmit={volumeForm.handleSubmit(handleSaveVolume)}
												className='mb-4 sm:mb-6 p-3 sm:p-4 bg-secondary/50 rounded-lg border'
											>
												<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 mb-4'>
													<FormField
														control={volumeForm.control}
														name='name'
														render={({ field }) => (
															<FormItem>
																<FormLabel>Volume Name</FormLabel>
																<FormControl>
																	<Input
																		{...field}
																		placeholder='Enter volume name'
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={volumeForm.control}
														name='type'
														render={({ field }) => (
															<FormItem>
																<FormLabel>Volume Type</FormLabel>
																<Select
																	onValueChange={field.onChange}
																	defaultValue={field.value}
																>
																	<FormControl>
																		<SelectTrigger>
																			<SelectValue placeholder='Select volume type' />
																		</SelectTrigger>
																	</FormControl>
																	<SelectContent>
																		<SelectItem value='local'>
																			Local Mount
																		</SelectItem>
																		<SelectItem value='nfs'>
																			NFS Share
																		</SelectItem>
																	</SelectContent>
																</Select>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={volumeForm.control}
														name='path'
														render={({ field }) => (
															<FormItem className='col-span-1 sm:col-span-2'>
																<FormLabel>Mount Path</FormLabel>
																<FormControl>
																	<Input
																		{...field}
																		placeholder='Enter mount path (e.g. /var/lib/data)'
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>

												<div className='flex flex-col-reverse sm:flex-row justify-end gap-2'>
													<Button
														type='button'
														variant='ghost'
														onClick={() => {
															setIsAddingVolume(false)
															setEditingVolume(null)
															volumeForm.reset()
														}}
													>
														Cancel
													</Button>
													<Button
														type='submit'
														variant='default'
														className='w-full sm:w-auto'
													>
														{editingVolume ? 'Save Changes' : 'Add Volume'}
													</Button>
												</div>
											</form>
										</Form>
									)}

									<div className='grid grid-cols-1 gap-3 sm:gap-4'>
										{volumes.map((volume) => (
											<div
												key={volume.id}
												className='flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-secondary/50 rounded-lg border group gap-3 sm:gap-4'
											>
												<div className='flex items-start gap-3'>
													<div className='mt-1'>
														<span className='inline-flex items-center justify-center rounded-md bg-primary/10 p-1.5 sm:p-2'>
															<HardDrive className='h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary' />
														</span>
													</div>
													<div>
														<h4 className='font-medium text-sm sm:text-base'>
															{volume.name}
														</h4>
														<p className='text-xs sm:text-sm text-muted-foreground'>
															{volume.path}
														</p>
														<div className='flex items-center gap-2 mt-1'>
															<span className='inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/20 px-1.5 sm:px-2 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-300 ring-1 ring-inset ring-blue-600/10'>
																{volume.type}
															</span>
															<span className='text-xs text-muted-foreground'>
																{volume.size}
															</span>
														</div>
													</div>
												</div>
												<div className='flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity border-t sm:border-0 pt-3 sm:pt-0'>
													<Button
														variant='ghost'
														size='sm'
														onClick={() => handleEditVolume(volume)}
														className='flex-1 sm:flex-none'
													>
														Edit
													</Button>
													<Button
														variant='ghost'
														size='sm'
														className='text-destructive hover:text-destructive flex-1 sm:flex-none'
														onClick={() => handleDeleteVolume(volume.id)}
													>
														<Trash2 className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
													</Button>
												</div>
											</div>
										))}
										{volumes.length === 0 && !isAddingVolume && (
											<div className='text-center py-6 sm:py-8 bg-secondary/50 rounded-lg border'>
												<HardDrive className='h-6 w-6 sm:h-8 sm:w-8 mx-auto text-muted-foreground mb-2 sm:mb-3' />
												<p className='text-sm sm:text-base font-medium mb-1'>
													No volumes configured
												</p>
												<p className='text-xs sm:text-sm text-muted-foreground'>
													Add a volume to persist data for this service
												</p>
											</div>
										)}
									</div>
								</div>
							</TabsContent>
						</div>
					</Tabs>

					{process.env.NODE_ENV === 'development' && (
						<div className='px-3 sm:px-6 pb-3 sm:pb-6 space-y-2 border-t'>
							<Label>Debug Information</Label>
							<pre className='p-3 sm:p-4 bg-muted rounded-md overflow-auto text-xs'>
								{JSON.stringify(
									{ values: formValues, errors: formErrors },
									null,
									2,
								)}
							</pre>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
