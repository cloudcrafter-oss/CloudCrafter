import type { StackDetailDto } from '@cloudcrafter/api/src/__generated__/types/StackDetailDto'

export const DummyInfoTab = ({
	stackDetails,
}: { stackDetails: StackDetailDto }) => {
	return <pre>{JSON.stringify({ stackDetails }, null, 2)}</pre>
}
