import { Input } from '@ui/components/ui/input.tsx'


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
