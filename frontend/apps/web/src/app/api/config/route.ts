import { NextResponse } from 'next/server'

export async function GET() {
	return NextResponse.json({
		backendUrl: process.env.CLOUDCRAFTER_AXIOS_BACKEND_BASEURL,
	})
}
