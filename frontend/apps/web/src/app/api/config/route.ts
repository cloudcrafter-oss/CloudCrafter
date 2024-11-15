import { NextResponse } from 'next/server'

export async function GET() {
	return NextResponse.json({
		backendUrl: process.env.CLOUDCRAFTER_PUBLIC_BACKEND_URL,
	})
}

export const dynamic = 'force-dynamic'
