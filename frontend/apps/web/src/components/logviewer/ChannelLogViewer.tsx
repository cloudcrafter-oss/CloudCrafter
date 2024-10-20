import { useWebHub } from '@/src/hooks/useWebHub'
import { LazyLog } from '@melloware/react-logviewer'

export const ChannelLogViewer = ({ channelId }: { channelId: string }) => {
	const { messages } = useWebHub()

	// iterate over messages and add new line after each so its one big string
	const logText = messages.map((message) => message.output.output).join('\n')

	return (
		<>
			<LazyLog width={700} text={logText} />
		</>
	)
}
