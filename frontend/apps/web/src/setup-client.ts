// import { axiosInstance } from '@kubb/plugin-client/clients/axios'
// import type {
// 	RequestConfig,
// 	ResponseConfig,
// } from '@kubb/plugin-client/clients/axios'
// import { getSession } from 'next-auth/react'
// import { auth } from './auth'
// import { backendEnv } from './core/env/cloudcrafter-env'

// Track if interceptors are already set up to avoid duplicates
// let interceptorsInitialized = false

// /**
//  * Set up global axios interceptors for both server and client environments
//  * This only needs to be run once during app initialization
//  */
// export const setupGlobalInterceptors = () => {
// 	// Only set up interceptors once
// 	if (interceptorsInitialized) {
// 		console.log('Interceptors already initialized!!')
// 		return
// 	}

// 	console.log('Setting up global axios interceptors')
// 	axiosInstance.defaults.baseURL = backendEnv.CLOUDCRAFTER_AXIOS_BACKEND_BASEURL

// 	// Add authentication interceptor
// 	axiosInstance.interceptors.request.use(async (request) => {
// 		const isServer = typeof window === 'undefined'
// 		let session = null

// 		if (isServer) {
// 			// Fetch session on the server side
// 			session = await auth()
// 		} else {
// 			// Fetch session on the client side
// 			session = await getSession()
// 		}

// 		if (session?.tokens?.access) {
// 			request.headers.Authorization = `Bearer ${session.tokens.access}`
// 		}

// 		return request
// 	})

// 	// Add response interceptor to handle errors
// 	axiosInstance.interceptors.response.use(
// 		(response) => response,
// 		(error) => {
// 			// Handle error
// 			console.error('Axios error:', error)
// 			return Promise.reject(error)
// 		},
// 	)

// 	interceptorsInitialized = true

// 	console.log(
// 		'IMPORTANT: Axios configured with baseURL:',
// 		backendEnv.CLOUDCRAFTER_AXIOS_BACKEND_BASEURL,
// 	)
// }

// // Legacy method - kept for backward compatibility
// export const updateClientAndSetupInterceptors = () => {
// 	// Just call our new singleton setup
// 	void setupGlobalInterceptors()
// }

// /**
//  * Generates a client that can be used for server actions to make API requests
//  * Returns a properly configured client that matches the expected interface
//  * used by the generated API functions like updateProject.
//  *
//  * NOTE: With global interceptors properly configured, this is no longer
//  * needed for most API calls. The axios instance will automatically handle
//  * authentication. This is kept for backward compatibility and special cases.
//  */
// export const generateBackendClient = () => {
// 	// Ensure interceptors are initialized (will only run once)
// 	void setupGlobalInterceptors()

// 	// Default config that will be applied to all requests
// 	const currentConfig: Partial<RequestConfig<unknown>> = {
// 		baseURL: backendEnv.CLOUDCRAFTER_AXIOS_BACKEND_BASEURL,
// 	}

// 	// The main request handler function
// 	const requestHandler = async <
// 		TData = unknown,
// 		TError = unknown,
// 		TVariables = unknown,
// 	>(
// 		config: RequestConfig<TVariables>,
// 	): Promise<ResponseConfig<TData>> => {
// 		const response = await axiosInstance({
// 			...currentConfig,
// 			...config,
// 		})

// 		return {
// 			data: response.data,
// 			status: response.status,
// 			statusText: response.statusText,
// 			headers: response.headers,
// 		}
// 	}

// 	// Add required methods to match the expected client interface
// 	requestHandler.getConfig = () => {
// 		return { ...currentConfig }
// 	}

// 	requestHandler.setConfig = (config: Partial<RequestConfig<unknown>>) => {
// 		// Since currentConfig is const, we can't reassign it
// 		// But we can update the axios instance with new defaults
// 		axiosInstance.defaults.baseURL = config.baseURL || currentConfig.baseURL
// 		return { ...currentConfig, ...config }
// 	}

// 	return requestHandler
// }
