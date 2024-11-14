'use client'
import {
    type GitProvider,
    GitProviderCard,
} from '@/src/components/settings/git/GitProviderCard'
import { BitbucketPopup } from '@/src/components/settings/git/providers/bitbucket/AddBitbucketPopup'
import { GithubPopup } from '@/src/components/settings/git/providers/github/AddGithubPopup'
import { GitlabPopup } from '@/src/components/settings/git/providers/gitlab/AddGitlabPopup'
import { ProviderOverviewDto } from '@/src/core/__generated__'
import { SiBitbucket, SiGithub, SiGitlab } from '@icons-pack/react-simple-icons'
import { Button } from '@ui/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@ui/components/ui/dialog'
import { Plus } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export const GitProvidersOverview = ({ list }: { list: ProviderOverviewDto }) => {
    const searchParams = useSearchParams()
    const [showSuccessPopup, setShowSuccessPopup] = useState(false)

    useEffect(() => {
        if (searchParams.get('message') === 'success') {
            setShowSuccessPopup(true)
        }
    }, [searchParams])

    // Example providers configuration
    const providers: GitProvider[] = [
        {
            id: 'github',
            name: 'GitHub',
            connected: false,
            icon: <SiGithub />,
            hasPopup: true,
            PopupComponent: GithubPopup,
        },
        {
            id: 'gitlab',
            name: 'GitLab',
            connected: false,
            icon: <SiGitlab />,
            hasPopup: true,
            PopupComponent: GitlabPopup,
        },
        {
            id: 'bitbucket',
            name: 'Bitbucket',
            connected: false,
            icon: <SiBitbucket />,
            hasPopup: true,
            PopupComponent: BitbucketPopup,
        },
    ]

    return (
        <>
            <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Success!</DialogTitle>
                    </DialogHeader>
                    <p>Git provider connected successfully</p>
                </DialogContent>
            </Dialog>

            <div className='container mx-auto py-8'>
                <div className='flex justify-between items-center mb-6'>
                    <h1 className='text-2xl font-bold'>Git Providers</h1>
                    <Button>
                        <Plus className='w-4 h-4 mr-2' />
                        Add Provider
                    </Button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {providers.map((provider) => (
                        <GitProviderCard key={provider.id} provider={provider} />
                    ))}
                </div>
            </div>
        </>
    )
}
