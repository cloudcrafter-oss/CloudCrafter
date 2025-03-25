// // Track if interceptors are set up
// let interceptorsInitialized = false

// // Initialize axios configuration
// function configureAxios() {
// 	// Set base URL from environment
// 	axiosInstance.defaults.baseURL = backendEnv.CLOUDCRAFTER_AXIOS_BACKEND_BASEURL

// 	// Only set up interceptors once
// 	if (!interceptorsInitialized) {
// 		// Add authentication interceptor to automatically include tokens
// 		axiosInstance.interceptors.request.use(async (config) => {
// 			try {
// 				const session = await auth()

// 				// If we have a valid session with tokens, add the Authorization header
// 				if (session?.tokens?.access) {
// 					config.headers = config.headers || {}
// 					config.headers.Authorization = `Bearer ${session.tokens.access}`
// 				}
// 			} catch (error) {
// 				// Just continue without auth headers if auth fails
// 				console.error('Error getting auth token for request:', error)
// 			}

// 			return config
// 		})

// 		interceptorsInitialized = true
// 		console.log(
// 			'Axios interceptors configured with baseURL:',
// 			backendEnv.CLOUDCRAFTER_AXIOS_BACKEND_BASEURL,
// 		)
// 	}
// }

// // Configure axios at startup
// setupGlobalInterceptors()

// // Custom middleware function that combines auth and other functionality
// export async function middleware(request: NextRequest) {
// 	// Ensure axios is configured
// 	configureAxios()

// 	// Run the auth middleware first
// 	const authResult = await auth()

// 	// If auth handled it with a redirect, return that
// 	if (authResult instanceof NextResponse) {
// 		return authResult
// 	}

// 	// Add your custom middleware code here
// 	// For example, you could add custom headers based on the route
// 	const response = NextResponse.next()

// 	// Add any custom headers or modifications to the response
// 	// response.headers.set('x-custom-header', 'some-value')

// 	return response
// }

export { auth as middleware } from './auth'

// export default auth((req) => {
// 	if (!req.auth && req.nextUrl.pathname.startsWith('/admin')) {
// 		const newUrl = new URL('/login', req.nextUrl.origin)
// 		//return Response.redirect(newUrl)
// 	}

// 	setupGlobalInterceptors()

// 	return NextResponse.next()
// })

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
	matcher: ['/((?!api|_next|static|public|favicon.ico).*)'],
}
