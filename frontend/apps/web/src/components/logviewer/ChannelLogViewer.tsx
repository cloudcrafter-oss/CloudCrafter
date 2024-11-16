import {
	type DeploymentLogDto,
	channelOutputLogLineLevelEnum,
	useGetDeploymentLogsHook,
} from '@/src/core/__generated__'
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

const formatLogMessage = (message: DeploymentLogDto) => {
	const date = new Date(message.at)
	const formattedDate = dayjs(date).format('DD-MM-YYYY HH:mm:ss')

	const output = `${formattedDate} => ${message.message}`

	const redLevels = [
		channelOutputLogLineLevelEnum.Error,
		channelOutputLogLineLevelEnum.Fatal,
	] as const

	if (redLevels.includes(message.level as (typeof redLevels)[number])) {
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

	const linesFromApi = data ?? []

	const allLines = [...linesFromApi, ...messages]

	// sort by date
	allLines.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())

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
