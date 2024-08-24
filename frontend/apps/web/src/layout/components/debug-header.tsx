'use client'
import { usePathname } from 'next/navigation'
import { Button } from '@ui/components/ui/button.tsx'

export const DebugHeader = () => {
    const pathname = usePathname()
    return <>
        <Button
            variant="secondary"
            role="combobox"
            className="w-[250px] justify-between"
        >
            {pathname}
        </Button>
    </>
}