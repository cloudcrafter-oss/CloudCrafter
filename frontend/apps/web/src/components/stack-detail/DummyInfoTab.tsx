import type { StackDetailDto } from '@/src/core/__generated__'

export const DummyInfoTab = ({
	stackDetails,
}: { stackDetails: StackDetailDto }) => {
	return <pre>{JSON.stringify({ stackDetails }, null, 2)}</pre>
}
