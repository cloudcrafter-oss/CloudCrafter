import { usePathname } from 'next/navigation'


export default function useCheckActiveNav() {
    const pathName = usePathname()

    const checkActiveNav = (nav: string) => {
        const pathArray = pathName.split('/').filter((item) => item !== '')

        if (nav === '/' && pathArray.length < 1) return true

        return pathArray.includes(nav.replace(/^\//, ''))
    }

    return { checkActiveNav }
}
