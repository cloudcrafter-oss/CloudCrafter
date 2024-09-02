import {
	validateStackRouteParams,
	type StackRouteParams,
} from '@/src/utils/routes/schemas'

interface PageProps {
	params: StackRouteParams
}

export default function StackPage({ params }: PageProps) {
	const routeData = validateStackRouteParams(params)
	return <pre>{JSON.stringify(routeData, null, 2)}</pre>
}
