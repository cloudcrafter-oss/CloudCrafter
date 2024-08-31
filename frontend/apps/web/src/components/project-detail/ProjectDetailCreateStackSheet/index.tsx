import { Button } from '@ui/components/ui/button'
import { Input } from '@ui/components/ui/input'
import { Label } from '@ui/components/ui/label'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@ui/components/ui/sheet'
import { Plus } from 'lucide-react'

export const ProjectDetailCreateStackSheet = () => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button size='sm' variant='outline'>
					Add New Stack
					<Plus className='ml-2 h-4 w-4' />
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Deploy new Stack</SheetTitle>
					<SheetDescription>
						Enter the details for your new Stack.
					</SheetDescription>
				</SheetHeader>
				<div className='grid gap-4 py-4'>
					<div className='grid grid-cols-4 items-center gap-4'>
						<Label htmlFor='github-url' className='text-right'>
							GitHub Repository (Public)
						</Label>
						<Input id='github-url' className='col-span-3' />
					</div>
				</div>
				<div className='mt-4 flex justify-end'>
					<Button type='submit'>Add Stack</Button>
				</div>
			</SheetContent>
		</Sheet>
	)
}
