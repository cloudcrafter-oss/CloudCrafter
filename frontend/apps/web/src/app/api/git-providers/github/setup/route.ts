import { auth } from '@/src/auth'
import { postCreateGithubApp } from '@cloudcrafter/api'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams
	const code = searchParams.get('code')
	const state = searchParams.get('state')

	if (!code || !state) {
		return new Response('Missing required parameters', { status: 400 })
	}

	const session = await auth()

	if (!session || session.error) {
		return new Response('Unauthorized', { status: 401 })
	}

	try {
		await postCreateGithubApp({
			code,
		})
	} catch (error) {
		return new Response('Error creating Github app', { status: 500 })
	}

	const host =
		request.headers.get('x-forwarded-host') ||
		request.headers.get('host') ||
		'localhost'
	const protocol = request.headers.get('x-forwarded-proto') || 'http'
	const baseUrl = `${protocol}://${host}`

	const url = new URL('/admin/settings/git-providers?message=success', baseUrl)

	return Response.redirect(url)
}
