import React from 'react'
import { CloudcrafterBreadcrumbs } from '@/src/layout/components/breadcrumbs.tsx'


interface TopNavProps extends React.HTMLAttributes<HTMLElement> {

}

export function TopNav() {
    return (
        <>
            {/*<div className='md:hidden'>*/}
            {/*    <CloudcrafterBreadcrumbs/>*/}
            {/*    /!*<DropdownMenu>*!/*/}
            {/*    /!*    <DropdownMenuTrigger asChild>*!/*/}
            {/*    /!*        <Button size='icon' variant='outline'>*!/*/}
            {/*    /!*            <IconMenu/>*!/*/}
            {/*    /!*        </Button>*!/*/}
            {/*    /!*    </DropdownMenuTrigger>*!/*/}
            {/*    /!*    <DropdownMenuContent side='bottom' align='start'>*!/*/}
            {/*    /!*        {links.map(({ title, href, isActive }) => (*!/*/}
            {/*    /!*            <DropdownMenuItem key={`${title}-${href}`} asChild>*!/*/}
            {/*    /!*                <Link*!/*/}
            {/*    /!*                    href={href}*!/*/}
            {/*    /!*                    className={!isActive ? 'text-muted-foreground' : ''}*!/*/}
            {/*    /!*                >*!/*/}
            {/*    /!*                    {title}*!/*/}
            {/*    /!*                </Link>*!/*/}
            {/*    /!*            </DropdownMenuItem>*!/*/}
            {/*    /!*        ))}*!/*/}
            {/*    /!*    </DropdownMenuContent>*!/*/}
            {/*    /!*</DropdownMenu>*!/*/}
            {/*</div>*/}

            <CloudcrafterBreadcrumbs/>
            {/*<nav*/}
            {/*    className={cn(*/}
            {/*        'hidden items-center space-x-4 md:flex lg:space-x-6',*/}
            {/*        className*/}
            {/*    )}*/}
            {/*    {...props}*/}
            {/*>*/}
            {/*    {links.map(({ title, href, isActive }) => (*/}
            {/*        <Link*/}
            {/*            key={`${title}-${href}`}*/}
            {/*            href={href}*/}
            {/*            className={`text-sm font-medium transition-colors hover:text-primary ${isActive ? '' : 'text-muted-foreground'}`}*/}
            {/*        >*/}
            {/*            {title}*/}
            {/*        </Link>*/}
            {/*    ))}*/}
            {/*</nav>*/}
        </>
    )
}
