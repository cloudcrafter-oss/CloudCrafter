import { auth } from '@/src/auth'
import { postCreateGithubApp, putUpdateGithubProvider } from '@cloudcrafter/api'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams
	const state = searchParams.get('state')

	if (!state) {
		return new Response('Missing required parameters', { status: 400 })
	}

	const stateParts = state.split(':')
	const stateType = stateParts[0]

	switch (stateType) {
		case 'github_init':
			return await githubInit(request, searchParams)
		case 'github_install':
			return await githubInstall(request, searchParams)
		default:
			return new Response('Invalid state', { status: 400 })
	}
}

const githubInstall = async (
	request: NextRequest,
	searchParams: URLSearchParams,
) => {
	const installationId = searchParams.get('installation_id')
	const state = searchParams.get('state')

	if (!installationId || !state) {
		return new Response('Missing required parameters', { status: 400 })
	}

	const stateParts = state.split(':')
	const providerId = stateParts[1]

	const session = await auth()

	if (!session || session.error) {
		return new Response('Unauthorized', { status: 401 })
	}

	await putUpdateGithubProvider(providerId, {
		installationId: Number.parseInt(installationId),
	})

	const host =
		request.headers.get('x-forwarded-host') ||
		request.headers.get('host') ||
		'localhost'
	const protocol = request.headers.get('x-forwarded-proto') || 'http'
	const baseUrl = `${protocol}://${host}`

	const url = new URL(
		'/admin/settings/git-providers?message=github_installed',
		baseUrl,
	)

	return Response.redirect(url)
}

const githubInit = async (
	request: NextRequest,
	searchParams: URLSearchParams,
) => {
	const code = searchParams.get('code')
	if (!code) {
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

	const url = new URL(
		'/admin/settings/git-providers?message=github_added',
		baseUrl,
	)

	return Response.redirect(url)
}
