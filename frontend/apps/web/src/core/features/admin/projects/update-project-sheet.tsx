'use server'
import { getServerById } from '@/src/core/__generated__'

export async function UpdateProjectSheet({ projectId }: { projectId: string }) {
	const project = await getServerById(projectId)

	return (
		<div>
			<h2>Project Settings</h2>
			<pre>{JSON.stringify(project, null, 2)}</pre>
			{/* Render project settings using projectDetails */}
		</div>
	)
}
