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
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@cloudcrafter/ui/components/tabs'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, Globe, HardDrive, Network } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { Debug } from '../../debug/debug'
import { VolumeList } from './volume-list'

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

	return (
		<div
			key={service.id}
			data-testid={`container-service-${service.id}`}
			className='bg-card rounded-lg border'
		>
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
									data-testid='tab-general'
									className='flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium relative text-muted-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-foreground'
								>
									<Globe className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
									General
								</TabsTrigger>
								<TabsTrigger
									value='network'
									data-testid='tab-network'
									className='flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium relative text-muted-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-foreground'
								>
									<Network className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
									Network
								</TabsTrigger>
								<TabsTrigger
									value='storage'
									data-testid='tab-storage'
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

							<TabsContent
								value='storage'
								data-testid='content-storage'
								className='mt-0 space-y-4 sm:space-y-6'
							>
								<VolumeList stackId={stackId} stackServiceId={service.id} />
							</TabsContent>
						</div>
					</Tabs>

					<Debug>
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
					</Debug>
				</div>
			)}
		</div>
	)
}
