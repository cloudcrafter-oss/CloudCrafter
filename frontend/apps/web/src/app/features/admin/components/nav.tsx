import { Link } from '@tanstack/react-router'
import clsx from 'clsx'

export function NavItem({
                            href,
                            children
                        }: {
    href: string;
    children: React.ReactNode;
}) {
    const pathname = ''

    return (
        <Link
            href={href}
            className={clsx(
                'flex items-center gap-3 rounded-lg  px-3 py-2 text-gray-900  transition-all hover:text-gray-900  dark:text-gray-50 dark:hover:text-gray-50',
                {
                    'bg-gray-100 dark:bg-gray-800': pathname === href
                }
            )}
        >
            {children}
        </Link>
    )
}
