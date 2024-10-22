import { useParams } from 'next/navigation'

export const useStack = () => {
	const params = useParams()
	const { 'stack-uuid': stackId } = params

	return {
		stackId,
	}
}
