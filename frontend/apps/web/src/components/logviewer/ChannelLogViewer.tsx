import type { ChannelOutputLogLine } from '@/src/core/__generated__/signal-types/channel-output-log-line'
import { useWebHub } from '@/src/hooks/useWebHub'
import { LazyLog } from '@melloware/react-logviewer'

const formatLogMessage = (message: ChannelOutputLogLine) => {
	return `${message.date} => ${message.output}`
}

export const ChannelLogViewer = ({ channelId }: { channelId: string }) => {
	const { messages } = useWebHub({
		channelId,
	})

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
