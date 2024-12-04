import {
	updateStackServiceCommandCommandSchema,
	useUpdateStackServiceHook,
} from '@cloudcrafter/api'
import type { StackServiceDto } from '@cloudcrafter/api/src/__generated__/types/StackServiceDto'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@ui/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@ui/components/ui/form'
import { Input } from '@ui/components/ui/input'
import { Label } from '@ui/components/ui/label'
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
	const form = useForm<z.infer<typeof updateStackServiceCommandCommandSchema>>({
		resolver: zodResolver(updateStackServiceCommandCommandSchema),
		defaultValues: {
			stackId: stackId,
			stackServiceId: service.id,
			name: service.name,
			domainName: service.httpConfiguration?.domainName,
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
		values: z.infer<typeof updateStackServiceCommandCommandSchema>,
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
