import { getProjects } from '@/src/core/__generated__'
import { NextResponse } from 'next/server'

export async function GET() {
	const projects = await getProjects({
		includeEnvironments: true,
	})

	return NextResponse.json(projects)
}
