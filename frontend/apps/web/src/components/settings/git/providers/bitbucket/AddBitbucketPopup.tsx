import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@cloudcrafter/ui/components/dialog'

export const BitbucketPopup: React.FC<{
	isOpen: boolean
	onOpenChange: (open: boolean) => void
}> = ({ isOpen, onOpenChange }) => {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Connect to BitBucket</DialogTitle>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
