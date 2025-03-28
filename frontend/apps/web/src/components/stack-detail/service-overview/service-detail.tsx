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
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

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
		<div key={service.id} className='border rounded-lg overflow-hidden'>
			<Button
				variant='ghost'
				className='w-full justify-between p-4 text-left hover:bg-secondary'
				onClick={() => toggleService(service.name)}
			>
				<span className='text-lg font-semibold'>{service.name}</span>
				{expandedService === service.name ? (
					<ChevronUp className='h-5 w-5' />
				) : (
					<ChevronDown className='h-5 w-5' />
				)}
			</Button>
			{expandedService === service.name && (
				<div className='p-4 bg-secondary/50'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Service name</FormLabel>
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
										<FormLabel>Container Port Exposes</FormLabel>
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
									<FormItem>
										<FormLabel>Container Health Check Port</FormLabel>
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
												placeholder='Enter container health check port (e.g. 3000)'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className='flex justify-end'>
								<Button type='submit'>Save Changes</Button>
							</div>

							<div className='space-y-2'>
								<Label>Debug Information</Label>
								<pre className='p-4 bg-muted rounded-md overflow-auto text-xs'>
									{JSON.stringify(
										{ values: formValues, errors: formErrors },
										null,
										2,
									)}
								</pre>
							</div>
						</form>
					</Form>
				</div>
			)}
		</div>
	)
}
