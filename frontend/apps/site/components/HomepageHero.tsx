'use client'
import { ChevronRightIcon } from '@heroicons/react/16/solid'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'

import { useState } from 'react'
import CloudCrafterLogo from '../assets/logo.png'
import Screenshot from '../assets/screenshot.webp'

export const HomepageHero = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	return (
		<div className='relative isolate overflow-hidden bg-white'>
			<svg
				aria-hidden='true'
				className='absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]'
			>
				<defs>
					<pattern
						x='50%'
						y={-1}
						id='0787a7c5-978c-4f66-83c7-11c213f99cb7'
						width={200}
						height={200}
						patternUnits='userSpaceOnUse'
					>
						<path d='M.5 200V.5H200' fill='none' />
					</pattern>
				</defs>
				<rect
					fill='url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)'
					width='100%'
					height='100%'
					strokeWidth={0}
				/>
			</svg>
			<div className='mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40'>
				{/* Navigation */}
				<nav className='absolute top-0 left-0 right-0 z-10'>
					<div className='mx-auto max-w-7xl px-6 lg:px-8'>
						<div className='flex items-center justify-between py-6'>
							<div className='flex lg:flex-1'>
								<Image
									src={CloudCrafterLogo}
									alt='CloudCrafter Logo'
									width={100}
									height={100}
								/>
							</div>

							{/* Desktop Navigation */}
							<div className='hidden lg:flex lg:gap-x-12'>
								<a
									href='#'
									className='text-sm font-semibold leading-6 text-gray-900'
								>
									Products
								</a>
								<a
									href='#'
									className='text-sm font-semibold leading-6 text-gray-900'
								>
									Features
								</a>
								<a
									href='#'
									className='text-sm font-semibold leading-6 text-gray-900'
								>
									About
								</a>
								<a
									href='#'
									className='text-sm font-semibold leading-6 text-gray-900'
								>
									Contact
								</a>
							</div>

							{/* Mobile menu button */}
							<div className='flex lg:hidden'>
								<button
									type='button'
									className='inline-flex items-center justify-center rounded-md p-2.5 text-gray-700'
									onClick={() => setMobileMenuOpen(true)}
								>
									<span className='sr-only'>Open main menu</span>
									<Menu className='h-6 w-6' aria-hidden='true' />
								</button>
							</div>
						</div>
					</div>

					{/* Mobile menu */}
					{mobileMenuOpen && (
						<div className='fixed inset-0 z-50 lg:hidden'>
							<div
								className='fixed inset-0 bg-black/30'
								aria-hidden='true'
								onClick={() => setMobileMenuOpen(false)}
							/>
							<div className='fixed inset-y-0 right-0 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm'>
								<div className='flex items-center justify-between'>
									<img
										alt='Your Company'
										src='/api/placeholder/32/32'
										className='h-8 w-auto'
									/>
									<button
										type='button'
										className='rounded-md p-2.5 text-gray-700'
										onClick={() => setMobileMenuOpen(false)}
									>
										<span className='sr-only'>Close menu</span>
										<X className='h-6 w-6' aria-hidden='true' />
									</button>
								</div>
								<div className='mt-6 flow-root'>
									<div className='space-y-2 py-6'>
										<a
											href='#'
											className='block px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50'
										>
											Products
										</a>
										<a
											href='#'
											className='block px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50'
										>
											Features
										</a>
										<a
											href='#'
											className='block px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50'
										>
											About
										</a>
										<a
											href='#'
											className='block px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50'
										>
											Contact
										</a>
									</div>
								</div>
							</div>
						</div>
					)}
				</nav>

				{/* Hero Content */}
				<div className='mx-auto max-w-2xl lg:mx-0 lg:flex-shrink-0 lg:pt-8'>
					<div className='mt-24 sm:mt-32 lg:mt-16'>
						<a href='#' className='inline-flex space-x-6'>
							<span className='rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10'>
								What's new
							</span>
							<span className='inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600'>
								<span>Just shipped v1.0</span>
								<ChevronRightIcon
									aria-hidden='true'
									className='h-5 w-5 text-gray-400'
								/>
							</span>
						</a>
					</div>
					<h1 className='mt-10 text-pretty text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl'>
						Deploy to the cloud with confidence
					</h1>
					<p className='mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8'>
						Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
						lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat.
					</p>
					<div className='mt-10 flex items-center gap-x-6'>
						<a
							href='#'
							className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
						>
							Get started
						</a>
						<a
							href='#'
							className='text-sm font-semibold leading-6 text-gray-900'
						>
							Learn more <span aria-hidden='true'>→</span>
						</a>
					</div>
				</div>
				<div className='mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32'>
					<div className='max-w-3xl flex-none sm:max-w-5xl lg:max-w-none'>
						<div className='-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
							<Image
								src={Screenshot}
								alt='CloudCrafter Screenshot'
								width={2432}
								height={1442}
								className='w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10'
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
