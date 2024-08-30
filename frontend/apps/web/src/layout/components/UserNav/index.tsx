import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@ui/components/ui/dropdown-menu'
import { User } from 'next-auth'
import { UserAvatar } from '@/src/layout/components/UserAvatar'
import { Button } from '@ui/components/ui/button.tsx'
import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

type Props = {
    user: Pick<User, 'name' | 'image' | 'email'>;
};

export const UserNav = ({ user }: Props) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar
                    user={{ name: user.name || null, image: user.image || null }}
                    className="h-8 w-8 cursor-pointer"
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-4 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                        {user.name && <p className="font-medium">{user.name}</p>}
                        {user.email && (
                            <p className="w-[200px] truncate text-sm text-zinc-700">
                                {user.email}
                            </p>
                        )}
                    </div>
                </div>
                <DropdownMenuSeparator/>
                <DropdownMenuItem asChild>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            void signOut()
                        }}
                    >
                        <LogOut className="mr-2 h-4 w-4" aria-hidden="true"/>
                        Log Out
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}