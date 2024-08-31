'use client'
import { Button } from '@ui/components/ui/button'
import { Input } from '@ui/components/ui/input'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@ui/components/ui/sheet'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@ui/components/ui/form'

const formSchema = z.object({
	gitRepository: z.string().url('Please enter a valid URL'),
})

export const ProjectDetailCreateStackSheet = () => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			gitRepository: '',
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		// Handle form submission
		console.log(values)
	}

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button size='sm' variant='outline'>
					Add New Stack
					<Plus className='ml-2 h-4 w-4' />
				</Button>
			</SheetTrigger>
			<SheetContent style={{ maxWidth: '33vw' }}>
				<SheetHeader>
					<SheetTitle>Deploy new Stack</SheetTitle>
					<SheetDescription>
						Enter the details for your new Stack.
					</SheetDescription>
				</SheetHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
						<FormField
							control={form.control}
							name='gitRepository'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Git Repository (Public)</FormLabel>
									<FormControl>
										<Input {...field} autoComplete='off' />
									</FormControl>
									<FormDescription>
										Enter the URL of your public Git repository.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type='submit'>Add Stack</Button>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	)
}
