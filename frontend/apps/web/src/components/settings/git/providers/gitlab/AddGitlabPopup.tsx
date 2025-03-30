import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@cloudcrafter/ui/components/dialog'

export const GitlabPopup: React.FC<{
	isOpen: boolean
	onOpenChange: (open: boolean) => void
}> = ({ isOpen, onOpenChange }) => {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-lg'>
				{' '}
				{/* Custom width */}
				<DialogHeader>
					<DialogTitle>Connect to GitLab</DialogTitle>
				</DialogHeader>
				{/* GitLab specific connection form */}
			</DialogContent>
		</Dialog>
	)
}
