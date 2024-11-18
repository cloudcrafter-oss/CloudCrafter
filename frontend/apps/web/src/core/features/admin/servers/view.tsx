'use client'
import { DeploymentStatusBadge } from '@/src/components/stack-detail/deployments/deployment-list'
import type { ServerDetailDto } from '@/src/core/__generated__'
import { useGetDeploymentsForServerHook } from '@/src/core/__generated__/hooks/useGetDeploymentsForServerHook'
import { Button } from '@ui/components/ui/button.tsx'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@ui/components/ui/card.tsx'
import { Input } from '@ui/components/ui/input.tsx'
import { Label } from '@ui/components/ui/label.tsx'
import { formatDistanceToNow } from 'date-fns'
import {
    CopyIcon,
    DatabaseIcon,
    PackageIcon,
    RefreshCwIcon,
    ServerIcon,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export const ViewServerDetail = ({ server }: { server: ServerDetailDto }) => {

    const { data: deployments } = useGetDeploymentsForServerHook(server.id)

    return (
        <div className='container mx-auto px-4 py-12 md:px-6 lg:px-8 grid md:grid-cols-2 gap-6'>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Server Configuration</CardTitle>
                        <CardDescription>
                            Manage your server settings for your Docker applications.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='grid gap-4'>
                        <div className='grid gap-2'>
                            <Label htmlFor='hostname'>Name</Label>
                            <Input id='hostname' defaultValue={server.name} />
                        </div>
                        <div className='grid gap-2'>
                            <Label htmlFor='hostname'>ID</Label>
                            <div className='flex gap-2'>
                                <Input
                                    readOnly
                                    id='hostname'
                                    defaultValue={server.id}
                                    className='flex-1'
                                />
                                <Button
                                    variant='outline'
                                    size='icon'
                                    onClick={() => {
                                        navigator.clipboard.writeText(server.id)
                                        toast.success('Copied Agent ID to clipboard')
                                    }}
                                >
                                    <CopyIcon className='h-4 w-4' />
                                </Button>
                            </div>
                        </div>
                        <div className='grid gap-2'>
                            <Label htmlFor='ssh-key'>Agent Secret</Label>
                            <div className='flex gap-2'>
                                <Input
                                    id='ssh-key'
                                    defaultValue={server.agentKey ?? ''}
                                    readOnly
                                    className='flex-1'
                                />
                                <Button
                                    variant='outline'
                                    size='icon'
                                    onClick={() => {
                                        navigator.clipboard.writeText(server.agentKey ?? '')
                                        toast.success('Copied Agent Secret to clipboard')
                                    }}
                                >
                                    <CopyIcon className='h-4 w-4' />
                                </Button>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    onClick={() => {
                                        // TODO: Add refresh functionality
                                    }}
                                >
                                    <RefreshCwIcon className='h-4 w-4' />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button>Save Changes</Button>
                    </CardFooter>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Deployments</CardTitle>
                        <CardDescription>
                            View the latest deployments for your applications.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='grid gap-4'>
                            {deployments?.map((deployment) => (
                                <div className='grid grid-cols-[40px_1fr] items-center gap-4'>
                                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground'>
                                        <PackageIcon className='h-5 w-5' />
                                    </div>
                                    <div>
                                        <div className='font-medium'>{deployment.stackName}</div>
                                        <div className='text-sm text-muted-foreground'>
                                            <span
                                                title={
                                                    new Date(
                                                        deployment.createdAt
                                                    ).toLocaleString()

                                                }
                                            >
                                                Deployed {formatDistanceToNow(
                                                    new Date(deployment.createdAt),
                                                    { addSuffix: true },
                                                )}
                                            </span>
                                        </div>
                                        <DeploymentStatusBadge state={deployment.state} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Link href='#' className='text-sm text-primary' prefetch={false}>
                            View all deployments
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
