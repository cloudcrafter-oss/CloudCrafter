import { useGetDeploymentLogsHook } from '@/src/core/__generated__'
import { useWebHub } from '@/src/hooks/useWebHub'
import { LazyLog } from '@melloware/react-logviewer'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@ui/components/ui/sheet'

const formatLogMessage = (message: LogViewerLine) => {
	return `${message.date} => ${message.content}`
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
				{channelId.length > 0 && <ChannelLogViewer channelId={channelId} />}
			</SheetContent>
		</Sheet>
	)
}

export const ChannelLogViewer = ({ channelId }: { channelId: string }) => {
	const { messages } = useWebHub({
		channelId,
	})

	const { data } = useGetDeploymentLogsHook(channelId)

	const linesFromApi: LogViewerLine[] = (data ?? []).map((line) => ({
		content: line.message,
		isError: line.isError,
		date: line.at,
	}))

	const channelMessages = messages.map((message) => ({
		content: formatLogMessage(message.output),
		isError: false,
		date: message.output.date,
	}))

	const allLines = [...linesFromApi, ...channelMessages]

	// sort by date
	allLines.sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
	)

	// iterate over messages and add new line after each so its one big string
	const logText = allLines
		.map((message) => formatLogMessage(message))
		.join('\n')

	return (
		<>
			<LazyLog height={200} follow width={700} text={logText} />
		</>
	)
}

interface LogViewerLine {
	content: string
	isError: boolean
	date: string
}
