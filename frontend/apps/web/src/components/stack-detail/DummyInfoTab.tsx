import type { StackDetailDto } from '@cloudcrafter/api'

export const DummyInfoTab = ({
	stackDetails,
}: { stackDetails: StackDetailDto }) => {
	return <pre>{JSON.stringify({ stackDetails }, null, 2)}</pre>
}
