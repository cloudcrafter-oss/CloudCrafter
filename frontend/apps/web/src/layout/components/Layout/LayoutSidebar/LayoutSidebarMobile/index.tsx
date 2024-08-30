'use client'
import { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@ui/components/ui/sheet.tsx'
import { MenuIcon } from 'lucide-react'
import { LayoutSidebarNav } from '@/src/layout/components/Layout/LayoutSidebar/LayoutSidebarNav'
import { NavItems } from '@/src/layout/components/Layout/LayoutSidebar'

export const LayoutSidebarMobile = () => {
    const [open, setOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <div className="flex items-center justify-center gap-2">
                        <MenuIcon/>
                        <h1 className="text-lg font-semibold">T3 app template</h1>
                    </div>
                </SheetTrigger>
                <SheetContent side="left" className="w-72">
                    <div className="px-1 py-6 pt-16">
                        <LayoutSidebarNav items={NavItems} setOpen={setOpen}/>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}