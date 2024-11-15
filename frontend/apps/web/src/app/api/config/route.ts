import { NextResponse } from 'next/server'

import { backendEnv } from '@/src/core/env/cloudcrafter-env'

export async function GET() {
	return NextResponse.json({
		backendUrl: backendEnv.CLOUDCRAFTER_AXIOS_BACKEND_BASEURL,
	})
}
