import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@cloudcrafter/ui/components/alert-dialog'

interface DeleteAlertProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	title: string
	description: string
	onConfirm: () => void
}

export const DeleteAlert = ({
	open,
	onOpenChange,
	title,
	description,
	onConfirm,
}: DeleteAlertProps) => {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
						onClick={() => {
							onConfirm()
							onOpenChange(false)
						}}
					>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
