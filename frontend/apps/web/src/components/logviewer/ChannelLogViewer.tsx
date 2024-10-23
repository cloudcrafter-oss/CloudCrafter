import { useGetDeploymentLogsHook } from '@/src/core/__generated__'
import type { ChannelOutputLogLine } from '@/src/core/__generated__/signal-types/channel-output-log-line'
import { useWebHub } from '@/src/hooks/useWebHub'
import { LazyLog } from '@melloware/react-logviewer'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@ui/components/ui/sheet'

const formatLogMessage = (message: ChannelOutputLogLine) => {
	return `${message.date} => ${message.output}`
}

export const ChannelLogViewerEnhanced = ({
	channelId,
	show,
	onHide,
}: { channelId: string; show: boolean; onHide: () => void }) => {
	return (
		<Sheet open={show} onOpenChange={onHide}>
			<SheetContent className='min-w-[800px]'>
				<SheetHeader>
					<SheetTitle>Logs</SheetTitle>
				</SheetHeader>
				<ChannelLogViewer channelId={channelId} />
			</SheetContent>
		</Sheet>
	)
}

export const ChannelLogViewer = ({ channelId }: { channelId: string }) => {
	const { messages } = useWebHub({
		channelId,
	})

	const { data } = useGetDeploymentLogsHook(channelId)

	console.log(data)

	// iterate over messages and add new line after each so its one big string
	const logText = messages
		.map((message) => formatLogMessage(message.output))
		.join('\n')

	return (
		<>
			<LazyLog height={200} follow width={700} text={logText} />
		</>
	)
}
