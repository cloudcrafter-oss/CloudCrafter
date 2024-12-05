import { getProjects } from '@cloudcrafter/api/__generated__/axios-backend'
import { NextResponse } from 'next/server'

export async function GET() {
	const projects = await getProjects({
		includeEnvironments: true,
	})

	return NextResponse.json(projects)
}
