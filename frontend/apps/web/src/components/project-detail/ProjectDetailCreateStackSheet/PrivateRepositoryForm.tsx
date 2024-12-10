import type { createStackCommandCommandSchema } from '@cloudcrafter/api'
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
import { Loader2 } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import type * as z from 'zod'
import { ServerSelect } from './ServerSelect'

interface PrivateRepositoryFormProps {
	form: UseFormReturn<z.infer<typeof createStackCommandCommandSchema>>
	onSubmit: (
		values: z.infer<typeof createStackCommandCommandSchema>,
	) => Promise<void>
	onBack: () => void
	inputDisabled: boolean
}

export const PrivateRepositoryForm = ({
	form,
	onSubmit,
	onBack,
	inputDisabled,
}: PrivateRepositoryFormProps) => {
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem className='space-y-2'>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input disabled={inputDisabled} {...field} autoComplete='off' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Add GitHub integration setup here */}
				<div className='p-4 border rounded-md'>
					<p className='text-sm text-muted-foreground'>
						To use private repositories, you need to set up GitHub integration
						first.
					</p>
					<Button className='mt-2' variant='outline'>
						Configure GitHub Integration
					</Button>
				</div>

				<ServerSelect form={form} inputDisabled={inputDisabled} />

				<div className='flex justify-between'>
					<Button type='button' variant='outline' onClick={onBack}>
						Back
					</Button>
					<Button type='submit' disabled={inputDisabled}>
						{inputDisabled && <Loader2 className='h-4 w-4 animate-spin mr-2' />}
						Add Stack
					</Button>
				</div>
			</form>
		</Form>
	)
}
