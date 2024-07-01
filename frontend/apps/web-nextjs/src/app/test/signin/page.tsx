import { providerMap } from '@/auth.ts'
import { signIn } from 'next-auth/react'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'


export default function Page() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6">Log in to acme.</h2>
                <div className="mb-4">
                    <input
                        disabled
                        type="email"
                        placeholder="Your email address"
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    disabled
                    className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-200">
                    Continue
                </button>
                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {Object.values(providerMap).map((provider) => (
                    <form
                        action={async () => {
                            'use server'
                            try {
                                await signIn(provider.id)
                            } catch (error) {
                                // Signin can fail for a number of reasons, such as the user
                                // not existing, or the user not having the correct role.
                                // In some cases, you may want to redirect to a custom error
                                if (error instanceof AuthError) {
                                    return redirect(`?error=${error.type}`)
                                }

                                // Otherwise if a redirects happens NextJS can handle it
                                // so you can just re-thrown the error and let NextJS handle it.
                                // Docs:
                                // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
                                throw error
                            }
                        }}
                    >
                        <button
                            className="w-full flex items-center justify-center bg-gray-100 text-gray-700 py-3 rounded-md hover:bg-gray-200 transition duration-200 mb-2">
                            Continue with {provider.name}
                        </button>
                    </form>
                ))}
                <p className="text-gray-500 text-xs mt-4">
                    By clicking continue, you acknowledge that you have read and agree to Acme's{' '}
                    <a href="#" className="text-blue-500 hover:underline">
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-blue-500 hover:underline">
                        Privacy Policy
                    </a>.
                </p>
            </div>
        </div>
    )
}