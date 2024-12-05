import { Input } from '@cloudcrafter/ui/components/input'

export const Search = () => {
	return (
		<div>
			<Input
				type='search'
				placeholder='Search...'
				className='md:w-[100px] lg:w-[300px]'
			/>
		</div>
	)
}
