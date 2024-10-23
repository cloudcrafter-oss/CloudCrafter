import { useGetDeploymentLogsHook } from '@/src/core/__generated__'
import { useWebHub } from '@/src/hooks/useWebHub'
import { LazyLog } from '@melloware/react-logviewer'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@ui/components/ui/sheet'
import chalk from 'chalk'
import dayjs from 'dayjs'

const formatLogMessage = (message: LogViewerLine) => {
	const date = new Date(message.date)
	const formattedDate = dayjs(date).format('DD-MM-YYYY HH:mm:ss')

	const output = `${formattedDate} => ${message.content}`

	if (message.isError) {
		return chalk.red(output)
	}

	return output
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

	const channelMessages: LogViewerLine[] = messages.map((message) => ({
		content: message.output.output,
		isError: message.output.isError,
		date: message.output.date.toString(),
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
		<div>
			<LazyLog width={700} height={700} text={logText} />
		</div>
	)
}

interface LogViewerLine {
	content: string
	isError: boolean
	date: string
}
