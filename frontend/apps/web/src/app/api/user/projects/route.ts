import { NextResponse } from 'next/server'
import { getProjects } from '@/src/core/generated'

export async function GET() {
    const projects = await getProjects({
        includeEnvironments: true
    })

    return NextResponse.json(projects)
}