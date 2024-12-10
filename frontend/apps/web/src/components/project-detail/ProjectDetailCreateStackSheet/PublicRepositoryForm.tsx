import type { createStackCommandCommandSchema } from '@cloudcrafter/api'
import { Button } from '@cloudcrafter/ui/components/button'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@cloudcrafter/ui/components/form'
import { Input } from '@cloudcrafter/ui/components/input'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import type * as z from 'zod'
import { ServerSelect } from './ServerSelect'

interface PublicRepositoryFormProps {
	form: UseFormReturn<z.infer<typeof createStackCommandCommandSchema>>
	onSubmit: (
		values: z.infer<typeof createStackCommandCommandSchema>,
	) => Promise<void>
	onBack: () => void
	validateRepository: (url: string) => Promise<boolean>
	isPending: boolean
	inputDisabled: boolean
}

export const PublicRepositoryForm = ({
	form,
	onSubmit,
	onBack,
	validateRepository,
	isPending,
	inputDisabled,
}: PublicRepositoryFormProps) => {
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
				<FormField
					control={form.control}
					name='gitRepository'
					render={({ field }) => (
						<FormItem className='space-y-2'>
							<FormLabel>Git Repository (Public)</FormLabel>
							<div className='flex space-x-2'>
								<FormControl>
									<Input
										{...field}
										disabled={inputDisabled || isPending}
										autoComplete='off'
										onBlur={(e) => {
											field.onBlur()
											validateRepository(e.target.value)
										}}
									/>
								</FormControl>
								<Button
									type='button'
									size='icon'
									variant={
										form.formState.errors.gitRepository
											? 'destructive'
											: 'outline'
									}
									onClick={() => validateRepository(field.value)}
									disabled={inputDisabled || isPending}
								>
									{isPending ? (
										<Loader2 className='h-4 w-4 animate-spin' />
									) : form.formState.errors.gitRepository ? (
										<XCircle className='h-4 w-4 ' />
									) : (
										<CheckCircle className='h-4 w-4' />
									)}
								</Button>
							</div>
							<FormDescription>
								Enter the URL of your public Git repository.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

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
